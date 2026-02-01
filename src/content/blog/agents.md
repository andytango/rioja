---
title: "AGENTS.md"
description: "How I use AI to accelerate development while maintaining rigour and quality"
pubDate: 2026-02-03
# draft: true
author: "Andrew Hall"
---

It has become common practice to include an AGENTS.md or CLAUDE.md file in a repository to steer AI coding assistants. But while the mechanism is well-known, the content often lacks direction. With well-published limits on how much context an LLM can effectively prioritise, the decision of what to include in these files becomes a resource allocation problem.

What I chose to include in my guidelines is not a matter of taste. I don't use these files to enforce arbitrary style preferences like tabs versus spaces. Instead, every rule is an optimisation for a specific objective: agent autonomy.

## The use case: backend complexity

Like many developers, I use AI for rapid prototyping. However, my focus is rarely on the frontend. I am not "vibe coding" user interfaces where feedback is visual and immediate. My work tends to focus on the backend: large-scale data engineering and new agentic systems.

In these environments, the value is driven by the integrity of the data outputs, not the pixels on the screen. A silent failure in a data pipeline is far more dangerous, and less obvious than a misaligned button.

Agents struggle with this type of invisible complexity. Unlike a UI tool like Lovable, where a human can instantly verify the output ("that looks wrong"), a backend system requires a deeper level of validation. If I have to manually review every line of logic to ensure a data transformation is correct, the time-saving value of the AI evaporates.

## The strategy: rigour as an enabler

To solve this, I optimise for success rates. I realised that to get an agent to work autonomously on complex logic, I needed to provide it with a solid foundation.

This leads to a counter-intuitive approach: my AGENTS.md files push for higher code quality standards than one would typically expect for a "prototype."

In a manual workflow, we often cut corners on testing and strict typing during the prototype phase to move faster. But when working with AI, ambiguity is a bug. Loose typing and lack of tests cause agents to hallucinate solutions or create regressions. By enforcing strict standards, I create self-correcting mechanisms that help the agent to iterate towards a working solution.

![Agent autonomy decision flow](/agent-autonomy-flow.svg)

Here are the specific patterns I enforce to achieve this.

### 1. The library of services

Context windows are finite, and agent reasoning degrades as complexity increases. To manage this, my guidelines explicitly push agents towards a "Library of Services" pattern.

We decouple logic into small, individually testable services with clear, simple interfaces. This allows the agent to reason about one component at a time without needing to hold the entire system state in its "head." Complexity is allowed to emerge from the composition of simple components, rather than from monolithic functions.

### 2. Test-driven development (TDD)

The "Library of Services" pattern enables the second pillar of my approach: test-driven development.

I require agents to write tests alongside implementation. This is not just about code quality; it is about self-correction. If an agent writes a test that fails, it receives an immediate error signal and can iterate to fix it without my intervention. This verification loop allows the agent to debug its own work, significantly increasing the autonomy of the session.

### 3. Triple verification

Agents are natural language processors first, and coders second. They are often better at writing prose than they are at managing complex state.

To leverage this, I enforce a "Triple Verification" standard. Code must be structured like a book: linear, readable, and heavily annotated with JSDoc or docstrings.

When I studied Economics, we demonstrated our understanding of a model in three ways: describing it in prose, defining it in mathematical notation, and illustrating it with diagrams. I apply a similar concept here. The agent must articulate its logic in:

- **The docstring**: The intent expressed in natural language.
- **The code**: The logic expressed in syntax.
- **The test**: The behaviour verified by execution.

When these three modalities align, the probability of a hallucination drops significantly.

## Conclusion

It is important to clarify that I have optimised these guidelines specifically for correctness and robustness because those are the prerequisites for autonomy in backend projects.

I would not recommend this approach for disposable one-off scripts, where the overhead of TDD and comprehensive documentation outweighs the value. Nor would I apply this blindly to existing projects where a framework imposes its own strict conventions or there are established patterns.

But for greenfield engineering projects where the goal is to build a working system with minimal human hand-holding, rigour is the fastest path to completion.
