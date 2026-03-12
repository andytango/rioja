---
title: "The 5th mode"
description: "Unleashing agent swarms for code review: a human-in-the-loop workflow that uses AI to audit itself, then dispatches a swarm to fix the fallout."
pubDate: 2026-03-12
author: "Andrew Hall"
draft: true
---

In my last post, I outlined the four modes I use to delegate work to AI coding agents, mapped across the axes of Stakes and Clarity. I ended that post with a prediction: this space moves so fast that my usage would likely evolve again in a matter of months, particularly regarding how "agentic swarms" might be used to parallelise tasks.

Well, it didn't take months. My workflow has already evolved.

I've introduced a new mode into my daily routine. It's an extension of the autonomous workflows I discussed previously, specifically designed for when I've had an agent work on a particularly ambitious set of changes.

When an agent writes hundreds of lines of complex logic across multiple files, the risk of subtle hallucinations, unhandled edge cases, and architectural drift increases. To combat this, I've developed a human-in-the-loop review workflow that leverages AI to audit itself, and then uses an agent swarm to fix the fallout.

Here is how the workflow operates.

### Step 1: The AI audit

After completing a large task (using any of the delegation modes I previously wrote about), I don't just merge the code. Instead, I spin up a completely clean, fresh Claude Code session.

I ask this new session to conduct a comprehensive review of the working changes and write its findings to a Markdown document. This works exceptionally well if you equip the agent with the official [`pr-review-toolkit` plugin](https://github.com/anthropics/claude-code/tree/main/plugins/pr-review-toolkit). Because this session has a clean context window, it approaches the diff with fresh eyes, acting purely as a ruthless reviewer rather than the author defending its own code.

### Step 2: The human checkpoint

Next, I step back into the loop. I open the generated Markdown document and go through the findings one by one, adding my own annotations inline.

My typical annotations look like this:
* *"Agree with recommendation, implement this."*
* *"Do this alternative fix instead."*
* *"We will revisit this in a subsequent iteration, ignore for now."*
* *"This isn't actually an issue, but the fact that you flagged it means it's confusing. Just add documentation so future reviewers know to ignore it."*

This step is crucial. It brings me right to the code where I can apply my engineering judgment. Yes, the AI will flag false positives, but I would much rather skim-check false positives than miss a hallucination or logic gap at the source. It keeps me anchored to the reality of the codebase.

### Step 3: The swarm remediation

Once I have annotated the document, the real magic happens.

I start *another* fresh Claude session. This time, I utilise Claude's [agent team feature](https://code.claude.com/docs/en/agent-teams). I feed it the annotated Markdown document and ask it to formulate a plan to address all the approved issues.

Because code review findings are typically dispersed across different files and functions (a missed null check here, a poorly named variable there) they are embarrassingly parallelisable. The agent team can fan out, addressing multiple distinct issues simultaneously without stepping on each other's toes.

I keep the swarm running, reviewing the subsequent test outputs, until all annotated issues are resolved.

### The missing piece

This workflow is highly complementary to my other techniques. It acts as a safety net for ambitious generation, combining the raw output speed of AI with the rigorous scrutiny of a multi-stage review process.

The only friction left in this process is the boilerplate. Spinning up fresh sessions, generating the markdown, annotating it, and feeding it back into a swarm requires manual orchestration.

What I really want is a dedicated workflow tool, or a specialised Claude Code plugin, that automates these repetitive steps. I want to hit a button, have the swarm generate the review, present me with a clean UI to rapidly accept, reject, or modify the findings, and then automatically dispatch the fixer agents.

A dedicated code-review workflow tool for the AI era. Maybe that's what I'll build for the next blog post.
