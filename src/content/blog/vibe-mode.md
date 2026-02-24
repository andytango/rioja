---
title: "Vibe mode"
description: "A decision matrix for deploying AI coding agents: when to review, supervise, code it yourself, or hand off autonomously."
pubDate: 2026-02-21
author: "Andrew Hall"
---

In the last 12 months, I have built an offline-first mobile app for the construction industry, worked on the APIs and an "App Store" for third-party integrations into a massive e-commerce platform, developed various tools for LLM-driven analysis of unstructured data, and, for fun, built a WebRTC-based TTY terminal that is slightly more reliable than SSH.

Throughout all of this, I have had a front-row seat to the rise of AI coding. I've also watched the surrounding circus: influencers declaring that "coding is dead," tech leaders banking on miraculous productivity gains, and a pervasive fear across the industry that anyone not using AI will be left behind by their competitors. I will admit that I have been tempted by the promise of true delegation, hoping to have AI agents build out my designs while I go out for coffee, and turning around features that would have previously taken hours in a matter of minutes.

So, should we all drop our IDEs and surrender our keyboards to Claude, Codex, and OpenCode? (Sorry, Gemini CLI, you've let me down too many times now).

Here comes the answer as old as software engineering itself: *it depends.*

No, really. It depends on exactly what you're trying to do. While I am just an *n=1* and don't claim to know everything, I've developed a specific decision matrix for how I deploy AI. It comes down to two axes: **stakes** (is this going to production?) and **clarity** (do I already know exactly how this should be built?).

Here are the five modes of operation I use today.

### Mode 1: The Reviewer (high stakes, high clarity)

This is for things like building CRUD endpoints, data entry forms, and standard data visualisations. I have a very good idea of what I expect to see and a strong understanding of the complexity.

In this mode, I will work with Claude on a plan and get it to show me examples of its proposed code so I know we're aligned. Once I give it the green light, I let it run, do something else, and come back to review the code. Reviewing is easy here because I'm just ensuring the output matches the mental model I already had.

![Reviewer mode flow](/vibe-mode-reviewer.svg)

### Mode 2: The Supervisor (high stakes, low clarity)

What if I know what I want to achieve, but there's complexity due to an unfamiliar codebase, new tools, or complex dependencies?

In this case, I will talk to the coding agent and force it to explain *in detail* everything that's going on before it writes a single line. This is incredibly valuable because I learn enough from the agent to be able to supervise it. Then, we plan and execute.

For these high-stakes tasks, it's critical that I understand exactly what is happening. I break the task down myself and work through it step-by-step with the agent. The AI is powerful, but protecting myself from cognitive overload and staying focused is vital to ensuring quality.

![Supervisor mode flow](/vibe-mode-supervisor.svg)

### Mode 3: The Founder (the learning exception)

There is a scenario where I largely ignore the coding agents: when I need to learn something new, and learn it really well.

Recently at work, we've been moving to a very faithful interpretation of the hexagonal architecture. I wanted to ensure my mental model of this was strong enough to supervise agents, and meaningfully review the work of my human colleagues, in the future.

For this, I am as hands-on as possible. I might ask AI to review *my* work, but I am writing the code. This is similar to the idea that startup founders should do every job in the company themselves before hiring other people, so they actually understand what the work entails.

![Founder mode flow](/vibe-mode-founder.svg)

### Mode 4: The Autonomous Loop (low stakes and prototyping)

Finally, there is low-stakes work: prototyping, exploratory coding, or my own personal projects. Here, I'm not worried about perfection on the first release. I'm happy for the agent to fail and for me to correct it.

But I also want the agent to be as autonomous as possible. For that to happen, it needs a self-correcting feedback loop.

What does that loop look like? As I discussed in my [AGENTS.md blog post](/blog/agents), if it's a backend piece of work, I focus on strong acceptance criteria and force the agent into a strict test-driven development (TDD) approach. If it's frontend-facing, I will get it to use the Playwright MCP.

I still use planning mode, but I typically give the agent a fairly large task to keep it occupied. If the task is sufficiently large, I use the ["Ralph Wiggum" loop pattern](https://awesomeclaude.ai/ralph-wiggum). Essentially, this involves wrapping the agent in a script that relentlessly re-prompts it with "keep going until you pass the tests" until it has self-verified the work is complete and emits a special completion signal.

![Autonomous loop flow](/vibe-mode-autonomous.svg)

### Mode 5: Vibe mode (quick fixes and refinements)

Woven between the other modes is a fifth pattern: vibe coding. This is not a separate phase so much as a texture: short, low-ceremony prompts for small fixes, visual tweaks, and exploratory iteration.

With this blog, for example, I vibe code the diagrams and illustrations. There is nothing here complex enough to justify batching up several hours of agent work. A quick prompt, a glance at the result, a small correction: that is the whole loop.

Vibe mode works best when the feedback is immediate and the cost of a mistake is low. The moment stakes or complexity rise, it is time to switch to one of the other modes.

![Vibe mode loop](/vibe-mode-vibe.svg)

### What's next?

This is a very fast-moving space, and I have no doubt that my usage will have evolved again in three months' time.

I'm particularly interested in how agentic swarms might perform with the latest generation of models. I experimented with swarms in the summer and concluded that traditional human titles (PM, QA, Architect, Developer) aren't quite the right boundaries for agent roles. Splitting AI up by human job titles just creates artificial communication bottlenecks without the benefit of human intuition.

DeepMind recently put out a [paper discussing these exact limitations of multi-agent systems](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/). But if we can figure out how these systems can efficiently parallelise tasks, and if the feedback loops between those agents, test suites, and browser automation continue to improve, the future looks very interesting for sure.
