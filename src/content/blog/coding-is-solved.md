---
title: "Coding is solved"
description: "Code has been getting cheaper for decades; AI just finished the job. But if we were never really paying for syntax, what were we paying for, and what does that mean for how we work now?"
pubDate: 2026-03-14
author: "Andrew Hall"
---

Coding is solved. At some point in the past 6 months, this went from being a question to a statement, with any subsequent discussion focusing on what this means, both for those within the tech industry and those outside it.

Let's take a step back for a moment. What do we mean by "coding"? If by coding we mean the act of translating a perfectly defined, unambiguous set of logical instructions into syntax that a machine can execute, then yes, it is effectively solved.

For many use cases, however, it was actually solved 10-15 years ago.

We have a prevalent misunderstanding in our industry that code is inherently expensive. The reality is that almost all of the history of computing has been about lowering the cost of code. Frameworks like Ruby on Rails and React replaced hand-rolled infrastructure. Cloud providers eliminated the need to manage servers. Overseas contractor networks globalised the labour market. Low-code tools let non-developers automate entire workflows. Each wave made code cheaper across a broader set of domains, and by the mid-2010s it was a commodity for a great many of them. AI is simply the latest expansion of that trend.

If code was already cheap, why does AI feel so disruptive? Because AI hasn't just lowered the cost of syntax; it has eliminated the communication overhead. To hand off a non-trivial feature to an engineering team, you previously had to work through hours of discovery meetings, write a 10-page requirements specification, or sometimes both. The bottleneck stopped being syntax a long time ago; it was always the translation of intent that mattered. So if code was already a commodity, what were we actually paying for all these years?

## The printing press

The answer is that the product is not the code; the product is the accumulation of design decisions that the code expresses, in the same way any piece of natural language is the expression of an idea. A colleague of mine recently pointed out that the printing press reduced the cost of books far more drastically than AI has reduced the cost of code, and so perhaps the magnitude of this innovation isn't as profound as we might think it is. This is an interesting economic observation, but it risks missing the second- and third-order effects.

![Movable type printing](/coding-solved-movable-type.svg)

The printing press, whether we look at Gutenberg's press in Europe or the movable type developed centuries earlier in China, didn't just make books cheaper to produce. The cost reduction was merely a catalyst; the real impact was multiplying the value of pre-existing intellectual work by making distribution near-free. Consider a scientific treatise: the real work was the research, experimentation and discussion that preceded it. The manuscript was an expression of that thinking; the printing press simply disseminated it. Multiply the value of that intellectual work by the ability to distribute it, and you have a network effect and, ultimately, the Scientific Revolution.

The parallel to software is direct. The valuable work is product strategy, domain modelling, requirements engineering, UX design, and systems design. We have all experienced this: an idea sounds beautifully simple when pitched over drinks or across a boardroom table, but the moment you get into the weeds of state management, compliance, device compatibility and edge cases, it becomes devilishly complex. That complexity lives in the elaboration and refinement, which is what we were paying for all along.

## The mechanical loom

A few years ago, my reference model for the AI revolution was the first Industrial Revolution. Software developers were operating much like artisans in cottage industries. It is tempting, then, to look at AI today as the arrival of the mechanical looms of the early textile mills, and bifurcate the "winners" and "losers" into those operating the LLMs (prompt engineers, vibe coders), and those owning them (big tech).

![Spinning jenny](/coding-solved-loom.svg)

But software engineering is not the mass production of identical yards of cotton. The mechanical loom created a winner-takes-all dynamic because the means of production were physical, expensive, and rivalrous: if you owned the mill, your competitors didn't. The means of production in our industry (large language models) are rented, not owned, and access to them is broadly equivalent. We are not manufacturing identical commodities. If we were, simple code generation templates would have replaced us all in 2010.

This distinction matters because it inverts the Industrial Revolution's logic. When everyone has access to the same tireless machine, raw execution cannot be a differentiator. Traditional software moats are evaporating: infrastructure, hosting, and security are increasingly swallowed up by platforms.

Even industries widely considered "safe" are being directly targeted: [Isomorphic Labs](https://www.isomorphiclabs.com/) is using AI to design drugs end-to-end with Eli Lilly and Novartis, [Harvey AI](https://www.harvey.ai/) is automating legal research for major law firms, and [Anduril](https://www.anduril.com/) is building autonomous defence systems. The printing press never sleeps and the mechanical loom doesn't take weekends off; if your advantage depends on doing the same thing as everyone else, only faster, it is not an advantage for long.

## Menlo Park

I now believe that a far more accurate analogy for the future of our industry is Thomas Edison and Menlo Park. Edison did not industrialise production; he industrialised *research and problem-solving*. He turned invention itself into a repeatable business model: formulate a hypothesis, prototype rapidly, test, iterate, and commercialise.

What made Menlo Park work was the concentration of diverse expertise under one roof. Edison assembled glassblowers, machinists, chemists, and physicists, then pointed them at a single problem. When developing the incandescent light bulb, these specialists worked in parallel: one team experimented with filament materials, another refined the glass envelope, another improved the vacuum pump. They could test a complete prototype within hours of a new idea, fail fast, and iterate. The invention factory's output wasn't any single product; it was the rate at which it could explore the solution space.

AI gives us access to the world's accumulated knowledge, and remote working lets us collaborate with human specialists across borders. AI agents can work parallel tracks: scaffolding an API, generating a front-end component, and writing integration tests. Continuous deployment pipelines then let us assemble and test the result within hours or even minutes.

Today, we can all live in Menlo Park. AI accelerates the entire loop, not just the final step of writing code, but the messy, experimental phase of figuring out if the product should exist at all.

## Hustling in 2026

If traditional moats no longer hold and invention itself is the business model, does this mean we should all get busy throwing ideas at the wall? Not quite. The Menlo Park model only works if the people directing it can think clearly about *which* ideas are worth testing. That depends on something no amount of AI can augment: the biological limits of the human brain.

For decades, what we know as "hustle culture" was driven by a need for VCs to generate returns in a power-law distributed portfolio, and when strategy and execution both sit within the same founding team, raw hours truly made a difference. A team working 80 hours per week can iterate towards product-market fit much faster than a team working 40 hours.

Today, strategy and execution are divided between those human founders and their virtual AI execution teams, and trying to compete with an AI on raw output is a losing equation.

Consider an example already playing out across the start-up world. Some non-technical founders and commercially-focused professionals are celebrating their liberation from developers, staying up at 3AM vibe-coding slick, visually impressive UI prototypes. But the moment that prototype clashes with the reality of enterprise sales, better-established and better-resourced incumbents, and unanticipated requirements that only surface at scale, it becomes all too clear where that time and effort should have been spent.

If Menlo Park is the *how* (rapid, AI-accelerated prototyping and iteration), then the *what* remains stubbornly human: the ability to think strategically, to model a domain, to anticipate second-order consequences, and to make judgement calls under uncertainty. These cognitive functions degrade measurably under fatigue and stress, in ways that routine execution does not. No framework, no agent, and no amount of vibe coding can substitute for them.

Whatever your role is, remaining hyper-focused on a single thread of execution is likely to be a thing of the past. For solo-founders and small teams, we now have six hats to wear simultaneously: strategy, sales, marketing, product, design and engineering. Even in larger organisations, specialists can use AI to self-serve straightforward answers and decisions that would have traditionally sat outside their swim-lane, and pursue parallel work-streams within it.

The opportunity cost calculation has fundamentally changed. An hour spent on implementation work that an AI could handle is an hour not spent on positioning, customer discovery, or systems design. And an hour spent grinding through execution at 2AM, when your prefrontal cortex is running on fumes, is worse than wasted; it is actively destroying the one asset that still differentiates you.

In a world where execution is a commodity, strategic clarity is the competitive advantage. Coding is solved; the question is what you do with the time it gives back.

![Coffee and a book](/coding-solved-coffee.svg)
