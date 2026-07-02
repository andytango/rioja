---
title: "Control plane"
description: "Part one of a series on building Agent Control Plane: a phone-first, agent-first interface for coding agents. The dead ends that led there, the first principles I started from, and the month it came together."
pubDate: 2026-05-31
author: "Andrew Hall"
draft: false
---

This is the first of three posts about a tool I have been building called Agent Control Plane. It is a self-hosted web interface for driving coding agents (Claude Code and Gemini CLI) from any device, and it has quietly become the way I do most of my delegation. This part is about why it exists.

![Agent Control Plane: a coding session in the chat view, showing the session list, the agent's thinking, its tool calls, and a diff of a new file](/control-plane-screenshot.png)

I should start with the obvious objection, because it is the one I had myself: the agents already ship perfectly good interfaces. Claude Code and Gemini CLI both run happily in a terminal. So why build anything?

## Coding is solved; delegation is not

In a [previous post](/blog/coding-is-solved) I argued that coding, in the narrow sense of turning a precise specification into syntax, is essentially solved. And in [Vibe mode](/blog/vibe-mode) I laid out the modes I use to hand work to agents, from close supervision to full autonomy. Put those two ideas together and a conclusion falls out: if writing the code is no longer the constraint, then the constraint moves to everything around the code. Specifying the work, dispatching it, watching it, and deciding when to intervene.

Once you accept that, the terminal looks like the wrong shape: it pins everything to one machine that I have to sit at. Part of that is fair. An agent on ambitious work needs me available, to catch design and architectural drift and make the calls only a human should. But a phone keeps me reachable without tying me to a desk.

The rest was just where the agent ran. It ran on my laptop, so the laptop had to stay awake to keep it going; I once carried it around the house, lid open, not because the agent needed me but to stop it stopping. The model calls are server-to-server anyway. The agent belongs on a server that never sleeps, and the laptop or phone is just a window onto it.

## The road here

Agent Control Plane was not the first thing I tried. It was the last in a line of attempts, and each of the earlier ones showed me something the eventual tool would need.

Last summer I started building my own agent harness. I abandoned it fairly quickly, and the reason is itself a lesson: for a side project, building the agent is reinventing the wheel. The frontier labs are pouring enormous effort into their harnesses, and I was never going to keep pace. I was working at the wrong layer.

In December I built a mobile, web-based TTY: a WebRTC-based terminal reachable from any browser. The brief there was remote-first: run the agent on a home server or a cloud VM and reach it from anywhere. It worked, and reconnecting was more reliable than raw SSH. But a terminal is fundamentally not a mobile experience. Even with a good native SSH client, juggling several sessions on a phone is awkward, and reconnection logic is fiddly. It was remote-first, but it was never going to be mobile-friendly.

I also tried Google's Antigravity. Its agent-manager concept was genuinely good, but it had no worktree support, and I could not use it with my own Claude Code quota. The tool I came closest to living in was [Zed's agent panel](https://zed.dev/blog/parallel-agents). It is excellent: lightweight, ergonomic, worktree-aware, and built on the [Agent Client Protocol](https://agentclientprotocol.com). But it is a desktop application, so there is no mobile story, and it follows Zed's roadmap, not mine.

In parallel with all of this, I had been building my own web-based wrapper for the Gemini CLI. I had not yet discovered ACP, and I was stubbornly trying to avoid holding any state in my own application: the wrapper was a thin layer over Gemini and the file system, and nothing more. That constraint is exactly what broke. I learned, the hard way, that I could not wish state away. A streaming, local-first, web experience needs a custom client-server model built for it, and the server has to be stateful. It is the lesson that became the founding invariants of Agent Control Plane.

Laid side by side, the gaps form a clear pattern. Each tool was missing a different thing, and no existing tool had them all.

<!-- This table is a candidate to render as an SVG in the blog's house style, like build-order-pipeline.svg -->

| Criterion | Own harness | Web TTY | Antigravity | Zed agent panel | Gemini web wrapper | **Agent Control Plane** |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Mobile-first | n/a | ✗ | ✗ | ✗ | ~ | ✓ |
| Remote-first | ✓ | ✓ | ~ | ✗ | ✓ | ✓ |
| New session without SSH | n/a | ✗ | ✓ | ✓ | ✓ | ✓ |
| Multi-session multiplexing | n/a | ~ | ✓ | ✓ | ✓ | ✓ |
| Worktree support | n/a | ~ | ✗ | ✓ | ✗ | ✓ |
| Bring-your-own agent and quota | ✗ | ✓ | ✗ | ✓ | ~ | ✓ |
| Coding-agent aware | ✓ | ✗ | ✓ | ✓ | ~ | ✓ |
| Offline-first and durable | ✗ | ✗ | ~ | ~ | ✗ | ✓ |
| Lightweight | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ |
| You own the roadmap | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ |

(✓ yes, ~ partial or awkward, ✗ no, n/a wrong layer to score. Zed and Antigravity are IDEs: they keep durable local state in remote mode, but there is no cross-device offline sync, which is the real differentiator.)

Having tried the alternatives, it was clearly worth trying to build something custom.

Since building it, I have found others arriving at the same idea, which is reassuring rather than discouraging. The closest is [Orca](https://www.onorca.dev/), an open-source agent development environment that runs coding agents in parallel across isolated worktrees, with your own subscriptions, and can even drive them on a remote box. Theo's [T3 Code](https://github.com/t3-oss/t3-code) is a similar idea in an Electron desktop app, with no phone story. [Coder](https://coder.com/solutions/agents) sits at the other end of the scale: coding agents as a self-hosted, governed platform for enterprise teams. All three confirm the direction. None is quite what I wanted, though. Orca is a full IDE, splits, terminals, an embedded browser, PDF preview, and its phone app is a companion to the desktop rather than a client in its own right. Coder is team infrastructure. I was after something lighter and narrower: a chat-first tool for a single operator, designed for the phone rather than bolted onto it, and mine to steer.

## Agentic development from first principles

The lessons from those earlier tools were one input. But Agent Control Plane was also an opportunity to rethink day-to-day software development from first principles, which is plainly what teams like Google's Antigravity are trying to do as well.

Cursor, JetBrains, and even Zed have been carrying around what increasingly looks like historical baggage: code editors, intellisense, git tooling, integrated terminals. A coding agent with shell access arguably makes much of it obsolete.

So that is where I decided to start. How much can you do from the agent chat window alone? Adding a feature is never free, and dogfooding Agent Control Plane has shown me precisely which features, layered on top of a minimal Claude Code wrapper, actually earn their place.

In other words, rather than working out how to fit a coding agent into an IDE, I am working out which tools and features the user genuinely needs alongside the chat view, and how to keep them inside it as much as possible, so the experience stays seamless.

In parallel, I get to work out how my own [agentic coding workflows](/blog/vibe-mode) can be streamlined and enhanced by bespoke tooling. My hope is that it leads somewhere genuinely useful.

Finally, the foundation. I built on the Agent Client Protocol, the open protocol co-driven by Zed Industries and JetBrains. ACP is what lets a single typed interface drive both Claude and Gemini, and it insulates me from any one vendor's direction. It was the right base precisely because my workflow keeps evolving, and it will not necessarily evolve in step with any single editor.

## The founding invariants

With the brief settled, I committed to a small set of invariants up front, and have held them since. The moving parts are deliberately few:

<picture>
  <source media="(max-width: 640px)" srcset="/control-plane-components-portrait.svg" />
  <img src="/control-plane-components.svg" alt="The components of Agent Control Plane: an agent harness, a Rust and SQLite backend, a browser-side sync worker, IndexedDB, and the UI" />
</picture>

Most of the invariants exist to tame the innate complexity of a local-first, event-sourced system.

- **ACP as the foundation, orchestrated not overlapped.** Agent Control Plane builds on the Agent Client Protocol but defines its own model on top, without duplicating it. That model governs the *delivery* of ACP messages in both directions: a client mutation is accepted and its delivery acknowledged immediately, while the mutation's real outcome arrives later as a return event from ACP. The send queue and inter-agent messaging orchestrate ACP; they never reach into its semantics.
- **Local-first.** The UI is a projection from IndexedDB. A separate process keeps IndexedDB in sync with the backend, and an IndexedDB outbox queue carries mutations from the client to the server.
- **IndexedDB owns only what Agent Control Plane is the system of record for.** The event log and everything projected from it live in IndexedDB. Externally-owned, multi-writer state, the project filesystem and git history, is fetched on demand and cached, never mirrored: Agent Control Plane is not its sole writer, so a local copy could only ever be a stale view.
- **Immutable events.** Events are strictly serial. The entire history is synchronised, and all state is projected from that history.
- **Unidirectional data flow.** State moves one way, from the event log through a projection into the UI. There is no parallel path that writes UI state directly from the stream.

Together these split one system cleanly across three responsibilities: the browser owns a local-first view, the server is the control plane (the event log's ordering authority and the ACP delivery layer), and the agent runtime owns the actual work. Reads flow one way, from the agent through the server to the UI; writes travel the opposite way, from an optimistic outbox to the agent that processes them.

<picture>
  <source media="(max-width: 640px)" srcset="/control-plane-dataflow-portrait.svg" />
  <img src="/control-plane-dataflow.svg" alt="The read path and write path through Agent Control Plane" />
</picture>

One further invariant is about product, not architecture. **Device parity:** mobile is not a cut-down version of the desktop; it is a complete substitute, with no feature degradation. Tablet and desktop gain nothing in capability; they simply use the larger screen to show more at once. So I design the phone experience first and recombine those pieces into the denser layouts, never the other way round.

<img class="phone" src="/control-plane-screenshot-mobile.png" alt="Agent Control Plane on a phone: the same chat session at mobile width, with nothing removed" />

And the commitment that matters most for the rest of this series: **build deliberately naive first.** Naive in two senses. Naive in system design, resisting complexity and abstraction until something concrete demanded them. And naive in features, shipping the smallest thing that worked before reaching for the next.

This is just lean, iterative development: a skateboard before a motorcycle before a car, where each stage is a usable whole rather than a half-finished chassis. It works because the next step on the roadmap only truly reveals itself once the basic features are built and tested. You cannot plan it in the abstract; you have to use the thing. It was liberating to organise development around that practical reality rather than around marketing claims, vision boards, and investor decks.

That approach is not universal, though: it is calibrated to how much it costs to be wrong here. Agent Control Plane is a single-operator tool I can roll back in seconds and whose every defect I see at once, so shipping something naive is cheap and easily undone. On a client's production system, with real users, long deployment cycles, and a wide blast radius, the same instinct would be reckless; there the rigour belongs up front. The right amount of rigour tracks the cost of being wrong, and that is a topic of its own, one I will come back to.

## A development timeline

Agent Control Plane itself was built in a single concentrated month. The first commit landed on 29 April 2026; by the end of May it had passed 475 commits and become the tool I reach for first. The rest of this series follows the shape of that month.

- **Late April: foundations.** The Leptos and Axum scaffold, the design system, and a first offline-first IndexedDB sync layer. A naive but complete skeleton.
- **Early May: the core.** The migration to event sourcing, ACP integration, and per-session choice of agent (Claude or Gemini).
- **Mid May: the data model settles.** SQLite persistence so sessions survive a restart, a typed ACP layer with per-vendor adapters, a strictly unidirectional data flow, and the log-generation and client-cache versioning scheme.
- **19 May: the switch.** The tool became good enough for real work, and within a few days it had replaced Zed as my primary environment. Everything after this point was built while living inside it.
- **Late May: the feature surge.** The composer, port forwarding, file uploads, the file viewer and diff view, per-session model selection, and the three-pane workspace. This is the material of the next post.
- **End of May: performance and polish.** Optimisation work as my own sessions grew large enough to hurt: streaming CPU, sidebar denormalisation, batched replay, and the move onto web workers. This is the material of the post after that.

A month is not long, but once the foundations were right, the roadmap wrote itself out of daily use: features where the chat view hit an edge, performance work where the event log grew heavy.

## Where this goes next

That is why Agent Control Plane exists. The bet is that as coding collapses into a commodity, the lasting value moves to the layer that directs the work, and that this layer should be device-independent, durable, asynchronous, and mine to steer. It is built from first principles on a small set of invariants I committed to early, starting from the chat view rather than retrofitting an IDE.

The next two posts follow the two strands of what happened after the naive first version met daily use. The second is about features: how I found the edges of a purely agent-driven experience, where a plain chat transcript turned out to be the wrong surface, and added the smallest targeted tools to fix each one. The third is about performance: how a deliberately simple pipeline behaved as the session history filled up, and how benchmarking, rather than guesswork, decided what to optimise. In both cases the method was the same, and it is the method I trust most: start simple, watch closely, and let the evidence tell you where to spend.
