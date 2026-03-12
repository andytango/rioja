---
title: "Review, swarm, repeat"
description: "Using agent swarms for code review: a human-in-the-loop workflow that uses AI to audit itself, then dispatches a swarm to fix the fallout."
pubDate: 2026-03-12
author: "Andrew Hall"
draft: false
---

This is a short follow-up to my [previous post](/blog/vibe-mode), where I outlined the five modes I use to delegate work to AI coding agents. I ended that post with a prediction: this space moves so fast that my usage would likely evolve again in a matter of months, particularly regarding how "agentic swarms" might be used to parallelise tasks.

Well, it didn't take months. My workflow has already evolved.

I've introduced a new technique into my daily routine. It's not a standalone mode so much as a complement to the autonomous workflows I discussed previously, specifically designed for when I've had an agent work on a particularly ambitious set of changes.

When an agent writes hundreds of lines of complex logic across multiple files, the risk of subtle hallucinations, unhandled edge cases, and architectural drift increases. To combat this, I've developed a human-in-the-loop review workflow that leverages AI to audit itself, and then uses an agent swarm to fix the fallout.

Here is how the workflow operates.

![Review, swarm, repeat cycle](/agent-swarms-cycle.svg)

### Step 1: The AI audit

After completing a large task (using any of the delegation modes I previously wrote about), I don't just merge the code. Instead, I spin up a completely clean, fresh Claude Code session.

Why a fresh session? LLMs are susceptible to confirmation bias. An agent that just spent an hour writing code has built up a context window full of its own reasoning, justifications, and assumptions. If you ask it to review its own work in the same session, it will tend to defend its choices rather than scrutinise them. A clean session has none of that baggage: it approaches the diff as a genuinely adversarial reviewer.

I ask this new session to conduct a comprehensive review of the working changes and write its findings to a Markdown document. This works exceptionally well if you equip the agent with the official [`pr-review-toolkit` plugin](https://github.com/anthropics/claude-code/tree/main/plugins/pr-review-toolkit), which gives the reviewer structured tools for diffing, blame analysis, and codebase navigation. The result is a thorough, unbiased audit that catches the kinds of issues the original agent would gloss over.

### Step 2: The human checkpoint

Next, I step back into the loop. I open the generated Markdown document and go through the findings one by one, adding my own annotations inline.

My typical annotations look like this:
* *"Agree with recommendation, implement this."*
* *"Do this alternative fix instead."*
* *"We will revisit this in a subsequent iteration, ignore for now."*
* *"This isn't actually an issue, but the fact that you flagged it means it's confusing. Just add documentation so future reviewers know to ignore it."*

This step is crucial. It brings me right to the code where I can apply my engineering judgment. Yes, the AI will flag false positives, but I would much rather skim-check false positives than miss a hallucination or logic gap at the source. It keeps me anchored to the reality of the codebase.

### Step 3: The swarm remediation

Once I have annotated the document, I hand it off to a swarm.

I start *another* fresh Claude session. This time, I utilise Claude's [agent team feature](https://code.claude.com/docs/en/agent-teams), which allows a primary agent to spawn sub-agents that work in parallel across isolated copies of the repository. I feed it the annotated Markdown document and ask it to formulate a plan to address all the approved issues.

Code review findings tend to be a good fit for parallelisation. A missed null check in one module, a poorly named variable in another, a missing test in a third: these are typically independent fixes touching different files and functions. Not always, of course; sometimes findings are entangled, and the agent needs to sequence them carefully. But that's exactly what the planning step is for. The primary agent reads the full set of annotations, identifies which fixes can safely run in parallel, and dispatches its sub-agents accordingly.

Here is an example of the kind of parallelism matrix the agent produces before dispatching its sub-agents:

![Parallelism matrix showing seven concurrent agent streams](/agent-swarms-parallelism.svg)

Once the swarm completes its fixes, I repeat the cycle: spin up another fresh reviewer session, generate a new audit, and annotate the findings again. This continues until the reviewer finds no more blocking issues. What counts as "blocking" depends on the context, just as the threshold for intervention varies across the different modes I described in the previous post.

### Early impressions

This workflow is still relatively new for me, and I'm continuing to evaluate where it fits. But the early results are promising. It acts as a safety net for ambitious generation, combining the raw output speed of AI with the rigorous scrutiny of a multi-stage review process.

The main friction is the manual orchestration: spinning up fresh sessions, generating the markdown, annotating it, and feeding it back into a swarm. If this workflow continues to prove its value, I plan to build a dedicated Claude Code plugin that automates these repetitive steps: generate the review, present a clean interface to rapidly triage the findings, and dispatch the fixer agents automatically.

The broader conclusion I keep arriving at is threefold. First, we are still finding ways to maximise efficiency with these tools; there is no settled playbook yet. Second, the path to greater autonomy runs through correctness: the more confidently you can verify an agent's output, the larger the tasks you can safely hand off. Third, keeping the human in the loop remains essential, not just as a quality gate, but as a way to stay sharp. Batch-reviewing dozens of small changes and decisions exercises the same coding and logic muscles that atrophy when you delegate everything blindly. This workflow offers a way to do all three at once.
