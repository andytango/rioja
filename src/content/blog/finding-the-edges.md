---
title: "Finding the edges"
description: "Part two of a series on building Agent Control Plane: the features it grew between May and July, which proved useful, which went unused, and which were never built and never missed."
pubDate: 2026-10-05
author: "Andrew Hall"
draft: false
---

This is the second of three posts about Agent Control Plane. [Part one](/blog/control-plane) covered why it exists. This one looks back at the features I added between mid-May and early July: which proved useful, which went unused, and which I considered but never built or missed.

From mid-May I did all my development in Agent Control Plane, including work on Agent Control Plane itself, so every gap in this post is one I ran into in daily use.

The stack made many of the features cheap. Leptos was a risk: it is young next to React and its ecosystem, and it compiles to WebAssembly. It worked surprisingly well. Markdown rendering, diffs, icon libraries and rexie (for IndexedDB) were all available off the shelf, and Tailwind worked as it would on any other stack.

The approach was to try and keep the user in a single place, the chat view, as much as possible. This meant that any new functionality should be added as agent tools, extensions to the chat UI, or a combination of both. I only added new surfaces alongside the chat window when absolutely necessary. After all, a coding agent with shell access can do a great deal.

## The basics and machine health

The first features were basic and standard: a session sidebar, file uploads, per-session model selection, and an `ask_user` tool, a richer version of the one Claude Code already has. I also built a view showing the agent's self-reported to-do list, since ACP already reports this list, but it turned out not to be useful. The agent did not keep the to-do list up to date consistently, and it was easier to judge progress by asking the agent and getting a written update, which gave a richer and more current picture than the to-do list could, all the more so later on, when a parent session that had delegated its work to child sessions was always free to answer.

<div class="shot-pair shot-pair-mixed">
  <figure class="shot shot-phone">
    <img class="shot-light" src="/control-plane-p2-sessions-light.png" alt="The session list on a phone: six sessions, each with its working directory and how long ago it was last active, two marked unread" />
    <img class="shot-dark" src="/control-plane-p2-sessions-dark.png" alt="" aria-hidden="true" />
    <button class="shot-toggle" type="button" aria-label="Toggle light or dark screenshot">◐</button>
  </figure>
  <figure class="shot shot-desktop">
    <img class="shot-light" src="/control-plane-p2-chat-light.png" alt="The same session list as a sidebar on the desktop, next to a chat in which the agent asks two questions with the ask_user tool: how due dates should appear, and where overdue tasks should go, with options to pick from" />
    <img class="shot-dark" src="/control-plane-p2-chat-dark.png" alt="" aria-hidden="true" />
    <button class="shot-toggle" type="button" aria-label="Toggle light or dark screenshot">◐</button>
  </figure>
</div>

The first real gap was understanding the health of the machine hosting the agents. I added a metrics panel showing CPU, memory and disk. The panel only reports; when something is wrong, the user asks an agent to kill the offending processes or clear disk space. It proved useful on the desktop as much as on the phone.

<figure class="shot shot-phone">
  <img class="shot-light" src="/control-plane-p2-metrics-light.png" alt="The metrics panel open on a phone: gauges for CPU, memory and disk, with memory and disk usage in gigabytes, over a dimmed chat session" />
  <img class="shot-dark" src="/control-plane-p2-metrics-dark.png" alt="" aria-hidden="true" />
  <button class="shot-toggle" type="button" aria-label="Toggle light or dark screenshot">◐</button>
</figure>

## Port forwarding

Another unmet need was being able to access and test artefacts and software that the agent was working on. As the host is headless, I needed a way to reach servers that the agent was running locally over port forwarding. A reverse proxy I had built for an earlier project ran to about 1,250 lines, with its own wildcard TLS and WebSocket tunnelling; this time I wrote around 400 lines of adapter over Cloudflare Tunnel, with a GUI to manage these in Agent Control Plane's settings panel. It turned out to be a feature I thought I needed but didn't: agents could just as easily set up access themselves, first with the Cloudflare CLI and later through the Cloudflare MCP connector.

## Reviewing the work

In terms of reviewing source code and documentation meanwhile, this initially meant leaving the tool and opening a GitHub pull request, and then adding comments which strangely appeared to be addressing myself, as agents would commit and raise the PR on my behalf. To keep this review process between me and the agent, I added a file viewer and a diff viewer, with syntax highlighting, and a tool for the agent to open files or changes in the viewer. Both worked reasonably well, although I would circle back to this feature later.

We can also see the mobile-first principle in action again. Panes that are full screen on mobile sit next to each other on desktop:

<figure class="shot shot-desktop">
  <img class="shot-light" src="/control-plane-p2-workspace-light.png" alt="Agent Control Plane on the desktop with three panes side by side: the session sidebar, a chat in which the agent reports its commit, and the diff of that commit" />
  <img class="shot-dark" src="/control-plane-p2-workspace-dark.png" alt="" aria-hidden="true" />
  <button class="shot-toggle" type="button" aria-label="Toggle light or dark screenshot">◐</button>
</figure>

## Coordinating agents

By this point I was regularly running several sessions at once, and handing work from one to another meant copying and pasting prompts, or writing a file both agents could read. I gave agents tools to view other agent sessions (`list_sessions`, `read_session`). One agent could now pick up another's work, diagnose another session that had gone wrong, or review what another had built.

Child sessions, in early June, were the biggest change in the whole period. Before them, I spun up parallel sessions by hand, working with a planner agent to generate a prompt for each one, which I then pasted in. With this feature I could plan with a single parent session, and then have it orchestrate child sessions. This had multiple benefits:

- The parent was always free to plan, start new work or answer questions while its children did the work.
- It could supervise its children and proactively resolve any execution issues.
- It would naturally review and critique their output.
- Long-running sessions could see entire projects through without bloating the context window or frequently compacting it.

A parent can also spawn sibling sessions: ordinary sessions that I collaborate with directly, which report back to the parent when they are done.

<figure class="shot shot-phone">
  <img class="shot-light" src="/control-plane-p2-children-light.png" alt="The session sidebar on a phone: three child sessions indented under their parent, ‘Plan: to-do app v2’, and a sibling session marked as spawned by it" />
  <img class="shot-dark" src="/control-plane-p2-children-dark.png" alt="" aria-hidden="true" />
  <button class="shot-toggle" type="button" aria-label="Toggle light or dark screenshot">◐</button>
</figure>

This hierarchy was supported by new agent tools. By mid-June a parent could list its children, see whether each was mid-turn, read a child's transcript from the start, and get a notification when a child's turn ended. Initially there was no way to cancel a turn already in progress, and a new instruction had to wait until the child finished whatever it was already doing. Later in June parents gained a newest-first tail read of a child's transcript, a readout of its turn state and pending messages, and tools to cancel a child's turn or interrupt it with a new instruction. This was one of the most effective features in Agent Control Plane.

## Archiving sessions

With agents spawning child and sibling sessions, the sidebar filled up. In mid-June I added session archiving. Later, again with an agent-first approach, agents got an `archive_session` tool, and they now automatically clean up their own child sessions.

## Away from the desk

Another major feature I added was push notifications. A notification when an agent's turn ends freed me from the desk, and from checking my phone every few minutes to see whether I was blocking anything. It is opt-in, and works from the installed app on the phone as well as the desktop browser.

Following that I tried to go further with a priority inbox: a queue of sessions waiting on the user, and an `escalate` tool agents could call to join it. This turned out, however, to just not be that useful. In practice, the push notifications themselves often gave me enough of a hint to know where to go, and whenever I opened up the tool, the session list made it easy to see which sessions needed me.

At the end of June I also added a PR tracker. It polls the status of each session's pull request and shows it in the sidebar, and the chat view, which saves the tokens otherwise spent asking an agent where things stand, or having to navigate GitHub's less-than-ideal UI.

## Back to review

I then returned to the review tools, adding inline comments to the workspace. The user selects a line in a file or diff, writes a comment, and the agent reads it with a `get_comment` tool. It was built for line-level review feedback. I tried it a few times, but it was still easier to type review comments in the chat, or to use GitHub pull requests. I put that down more to the implementation than the design: the agent found it hard to work out how to build this in Leptos, possibly due to a lack of good examples in its training data. At this point I missed React, which almost certainly has a library for it.

## Taking stock

Looking back, the chat window went further than I expected, and the hypothesis that starting from it would lead to something new, and better than traditional IDEs for coding was largely proven.

The features that went unused were each beaten by the agent or the chat. Asking the agent for a status was quicker than reading the to-do list; push notifications and the session list made the inbox unnecessary; typing a review comment was quicker than anchoring one to a line; and agents set up their own tunnels with Cloudflare's tools.

The features that lasted did one of three things:

- Gave the agent a new capability: showing a file or diff, reading other sessions, spawning children and archiving them.
- Showed the user something the chat could not: machine health and PR status.
- Reached the user away from the desk: push notifications.

I had also experimented with auto-summarising sessions with Claude Haiku, so that other agents could search them and avoid loading their entire context, and the user could have a feature similar to Claude Code's "recap" feature. As with the agent's to-do list and port forwarding, it turned out that agents were smart enough to paginate through the other sessions without bloating their context window, or they could run searches directly against the system's SQLite database. Meanwhile, instead of the tool showing me a Haiku recap, it was easier to just prompt a session to give me a concise, overall status directly, whenever I wanted it.

I never built a code editor, SQL console, integrated terminal, git UI or file gallery, and never missed them; the agent does that work.

Voice is the gap I would still close. Text-to-speech for reading agent replies aloud never shipped, because the voice quality did not justify the server resources and I did not want to pay for an external API. A telephone agent on the Gemini Live API went much better: on a call, it could see every session, report on them and act on them, so I could follow my agents hands-free when out with my phone. It also appeared to be more cost-effective than text-to-speech. With more time, I would have pursued it.

Much of the value came from less visible work: light and dark themes, the core UX and reliability. The last post covers how the tool stayed fast as its event log grew.
