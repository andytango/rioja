/**
 * Blog syndication script (zero external dependencies).
 *
 * Scans all blog posts in src/content/blog/, finds the oldest post that
 * has not yet been syndicated, and cross-posts it to Medium (priority),
 * then X/Twitter, LinkedIn, and Bluesky. A maximum of one post is
 * syndicated per run (intended to be triggered weekly via cron).
 *
 * Syndication state is tracked via a `syndicated` field in each post's
 * YAML frontmatter. Once a post is successfully published to Medium
 * (the priority platform), the field is set to the current date.
 *
 * Modes:
 *   DRY_RUN=true   – Dumps full API payloads to stdout as JSON without
 *                     calling any external APIs. Useful for testing.
 *   DRY_RUN=false  – Calls real APIs (default).
 *
 * Each platform is independently guarded by its secrets: if a platform's
 * credentials are missing, it is silently skipped.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHmac, randomBytes } from "node:crypto";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    fm[key] = val;
  }
  return fm;
}

function getSlug(filePath) {
  return filePath.split("/").pop().replace(/\.md$/, "");
}

function getCanonicalUrl(slug) {
  const base = process.env.SITE_URL || "https://www.rioja.io";
  return `${base}/blog/${slug}`;
}

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, "");
}

function isDryRun() {
  return process.env.DRY_RUN === "true";
}

function log(platform, message) {
  console.log(`[${platform}] ${message}`);
}

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  if (!res.ok) {
    const err = new Error(`${res.status} ${res.statusText}`);
    err.body = body;
    throw err;
  }
  return body;
}

// ---------------------------------------------------------------------------
// Post discovery
// ---------------------------------------------------------------------------

function findNextUnsyndicated(blogDir) {
  const files = readdirSync(blogDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => join(blogDir, f));

  const candidates = [];

  for (const filePath of files) {
    const raw = readFileSync(filePath, "utf-8");
    const fm = parseFrontmatter(raw);

    // Skip drafts
    if (fm.draft === "true") continue;

    // Skip already-syndicated posts
    if (fm.syndicated) continue;

    // Must have a pubDate to be eligible
    if (!fm.pubDate) continue;

    candidates.push({
      filePath,
      raw,
      fm,
      pubDate: new Date(fm.pubDate),
    });
  }

  if (candidates.length === 0) return null;

  // Sort oldest first
  candidates.sort((a, b) => a.pubDate - b.pubDate);
  return candidates[0];
}

function markAsSyndicated(filePath, content) {
  const today = new Date().toISOString().slice(0, 10);
  // Insert syndicated field before the closing ---
  const updated = content.replace(
    /\r?\n---(\r?\n)/,
    (match, trailing) => `\nsyndicated: ${today}${match}`,
  );
  writeFileSync(filePath, updated, "utf-8");
  log("Frontmatter", `marked ${filePath} as syndicated (${today})`);
  return updated;
}

// ---------------------------------------------------------------------------
// Medium (priority platform)
// ---------------------------------------------------------------------------

async function postToMedium({ title, markdown, canonicalUrl }) {
  const token = process.env.MEDIUM_TOKEN;
  if (!token) {
    log("Medium", "skipped (no MEDIUM_TOKEN)");
    return false;
  }

  const payload = {
    title,
    contentFormat: "markdown",
    content: `# ${title}\n\n${markdown}`,
    canonicalUrl,
    publishStatus: "public",
  };

  if (isDryRun()) {
    log("Medium", "DRY RUN payload:");
    console.log(JSON.stringify({ platform: "medium", url: "https://api.medium.com/v1/users/{userId}/posts", payload }, null, 2));
    return true;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const me = await jsonFetch("https://api.medium.com/v1/me", { headers });
  const userId = me.data.id;
  log("Medium", `authenticated as ${me.data.username}`);

  const post = await jsonFetch(
    `https://api.medium.com/v1/users/${userId}/posts`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    },
  );
  log("Medium", `published: ${post.data.url}`);
  return true;
}

// ---------------------------------------------------------------------------
// X / Twitter (OAuth 1.0a)
// ---------------------------------------------------------------------------

function percentEncode(str) {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function buildOAuthHeader(method, url, params, consumerKey, consumerSecret, token, tokenSecret) {
  const oauthParams = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: token,
    oauth_version: "1.0",
  };

  const allParams = { ...oauthParams, ...params };
  const paramString = Object.keys(allParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join("&");

  const baseString = [method.toUpperCase(), percentEncode(url), percentEncode(paramString)].join("&");
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  const signature = createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;

  const header = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");

  return `OAuth ${header}`;
}

async function postToTwitter({ title, description, canonicalUrl }) {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    log("Twitter", "skipped (missing credentials)");
    return;
  }

  const text = `${title}\n\n${description}\n\n${canonicalUrl}`;

  const tweetUrl = "https://api.x.com/2/tweets";
  const payload = { text };

  const auth = buildOAuthHeader("POST", tweetUrl, {}, apiKey, apiSecret, accessToken, accessSecret);

  if (isDryRun()) {
    log("Twitter", "DRY RUN payload:");
    console.log(JSON.stringify({ platform: "twitter", url: tweetUrl, payload, oauthHeader: auth }, null, 2));
    return;
  }

  const body = JSON.stringify(payload);

  const result = await jsonFetch(tweetUrl, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body,
  });
  log("Twitter", `posted: https://x.com/i/status/${result.data.id}`);
}

// ---------------------------------------------------------------------------
// Bluesky (AT Protocol)
// ---------------------------------------------------------------------------

async function postToBluesky({ title, description, canonicalUrl }) {
  const handle = process.env.BLUESKY_HANDLE;
  const appPassword = process.env.BLUESKY_APP_PASSWORD;

  if (!handle || !appPassword) {
    log("Bluesky", "skipped (missing credentials)");
    return;
  }

  const text = `${title}\n\n${description}\n\n${canonicalUrl}`;
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  const urlBytes = encoder.encode(canonicalUrl);
  const urlByteStart = textBytes.length - urlBytes.length;
  const urlByteEnd = textBytes.length;

  const record = {
    $type: "app.bsky.feed.post",
    text,
    createdAt: new Date().toISOString(),
    facets: [
      {
        index: { byteStart: urlByteStart, byteEnd: urlByteEnd },
        features: [
          {
            $type: "app.bsky.richtext.facet#link",
            uri: canonicalUrl,
          },
        ],
      },
    ],
    embed: {
      $type: "app.bsky.embed.external",
      external: {
        uri: canonicalUrl,
        title,
        description: description || "",
      },
    },
  };

  const payload = {
    collection: "app.bsky.feed.post",
    record,
  };

  if (isDryRun()) {
    log("Bluesky", "DRY RUN payload:");
    console.log(JSON.stringify({ platform: "bluesky", url: "https://bsky.social/xrpc/com.atproto.repo.createRecord", payload }, null, 2));
    return;
  }

  const session = await jsonFetch(
    "https://bsky.social/xrpc/com.atproto.server.createSession",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: handle, password: appPassword }),
    },
  );
  log("Bluesky", `authenticated as ${session.handle}`);

  const result = await jsonFetch(
    "https://bsky.social/xrpc/com.atproto.repo.createRecord",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repo: session.did,
        ...payload,
      }),
    },
  );
  log("Bluesky", `posted: ${result.uri}`);
}

// ---------------------------------------------------------------------------
// LinkedIn
// ---------------------------------------------------------------------------

async function postToLinkedIn({ title, description, canonicalUrl }) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const personId = process.env.LINKEDIN_PERSON_ID;

  if (!token || !personId) {
    log("LinkedIn", "skipped (missing credentials)");
    return;
  }

  const linkedInUrl = "https://api.linkedin.com/rest/posts";
  const payload = {
    author: `urn:li:person:${personId}`,
    commentary: `${title}\n\n${description}`,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: canonicalUrl,
        title,
        description: description || "",
      },
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  if (isDryRun()) {
    log("LinkedIn", "DRY RUN payload:");
    console.log(JSON.stringify({ platform: "linkedin", url: linkedInUrl, payload }, null, 2));
    return;
  }

  await jsonFetch(linkedInUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202401",
    },
    body: JSON.stringify(payload),
  });
  log("LinkedIn", "shared article successfully");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const blogDir = process.env.BLOG_DIR || "src/content/blog";

  console.log(`Scanning ${blogDir} for unsyndicated posts...`);
  if (isDryRun()) console.log("DRY RUN mode enabled: no APIs will be called, payloads will be dumped.\n");

  const post = findNextUnsyndicated(blogDir);

  if (!post) {
    console.log("No unsyndicated posts found. Nothing to do.");
    return;
  }

  const { filePath, raw, fm } = post;
  const title = fm.title || "Untitled";
  const description = fm.description || "";
  const slug = getSlug(filePath);
  const canonicalUrl = getCanonicalUrl(slug);
  const markdown = stripFrontmatter(raw);

  console.log(`Selected: "${title}" (${filePath})`);
  console.log(`Published: ${fm.pubDate}`);
  console.log(`Canonical URL: ${canonicalUrl}\n`);

  const payload = { title, description, markdown, canonicalUrl };

  // Medium is the priority platform: syndicate there first
  let mediumSuccess = false;
  try {
    mediumSuccess = await postToMedium(payload);
  } catch (err) {
    console.error(`[Medium] ERROR: ${err.message}`);
    if (err.body) console.error(JSON.stringify(err.body, null, 2));
  }

  // Syndicate to remaining platforms (best-effort, in parallel)
  const secondary = await Promise.allSettled([
    postToTwitter(payload),
    postToBluesky(payload),
    postToLinkedIn(payload),
  ]);

  let secondaryFailed = false;
  for (const r of secondary) {
    if (r.status === "rejected") {
      console.error(`Platform error: ${r.reason.message}`);
      if (r.reason.body) console.error(JSON.stringify(r.reason.body, null, 2));
      secondaryFailed = true;
    }
  }

  // Mark as syndicated if Medium succeeded (or if in dry run mode, skip marking)
  if (isDryRun()) {
    log("Frontmatter", `DRY RUN: would mark ${filePath} as syndicated`);
  } else if (mediumSuccess) {
    markAsSyndicated(filePath, raw);
  }

  if (secondaryFailed) {
    console.log("\nSome secondary platforms failed (see errors above). Medium may have succeeded.");
  }

  console.log("\nSyndication complete.");
}

main();
