---
title: "Strategy by other means"
description: "Every choice in product development is a strategic move—a vote for a specific future. From tech stack to team structure, we examine the 'why' behind execution."
pubDate: 2026-01-31
---

Carl von Clausewitz famously wrote that war is the continuation of politics by other means. In the world of building things, I believe a similar truth applies: **Product development is the continuation of strategy by other means.**

Every choice we make, from the programming language we select to the way we structure our teams, is a strategic move. It is a vote for a specific future. Sometimes that vote is for speed, sometimes for stability, and sometimes for scalability. The danger lies not in making the "wrong" choice, but in making a choice without realizing you are making one at all.

This blog is an attempt to document those choices. Over the coming months, I plan to dissect the decisions I've faced in my career. I won't just be talking about code; this is about product development and technical decision-making in the broadest sense. From architectural forks in the road to the human dynamics of team structures, my goal is to capture the "why" behind the execution.

To kick things off, it makes sense to start with the most immediate decision in front of you: Why I built this site the way I did.

## The strategy

Before starting any development, I had to define what this site actually is. It is not a portfolio, as I have a LinkedIn profile for that. It is not a demonstration of my coding ability, as my current and future open-source work handles that.

The strategy here was simple: **capture my learnings and experiences so that future partners, collaborators and, yes, employers can see how I approach problems.**

If the goal is clarity and communication, then the design decision becomes obvious. We need to minimiseany noise.

## The execution: AI as a collaborator

To build the site, I used AstroJS deployed on GitHub Pages. It's a mature, low-cost stack that minimizes time burned on DevOps. But the way I reached the design was different.

I used Claude Code, but I didn't just ask it to "make me a website." I view AI not as a replacement for creativity, but as a mechanism for rapid iteration. I worked through the design process closely, building up from core components (the title, the hero image, the blurb) and shaping the content in parallel.

I didn't delegate the aesthetic to an LLM or a generic component library. I used the AI to handle the boilerplate so I could focus on the distinctive elements, fitting the design around the content rather than forcing content into a template.

## The design: performance is a feature

You will notice a lack of complex 3D graphics, scroll-jacking animations, or heavy interactivity. Today, "flashy" is a commodity. You can prompt a tool to generate a visual spectacle in seconds. But complexity comes with a cost: accessibility and performance.

I made the conscious decision to invest in typography and layout rather than animation. I chose a distinctive font and focused on a design that compresses well and pre-fetches efficiently. Whether you are viewing this on a high-end monitor in a dark room or on an older phone with a weak connection, the experience should remain consistent.

## Moving forward

In future posts, I want to explore the tension between competing priorities that defines software engineering. I plan to look at how we balance the need for rapid delivery against the need for rigorous stability, and how we decide when to embrace new paradigms versus when to stick with established patterns.

This isn't about providing a set of instructions or claiming to have the perfect answer. It is about exposing the thought process behind the trade-offs we make every day.

I hope sharing these notes proves useful to others navigating the same landscape.
