---
title: "Build order"
description: "When building data products, where you start is a risk management decision: output-backwards, input-forwards, or middle-out. The right answer depends on where uncertainty lives in your value chain."
pubDate: 2026-02-06
---

When building software, it is not always obvious where to start. Do you begin with the user interface and work backward, or with the unseen core and work forward?

For simple applications, it doesn't matter much. But for data products (systems that collect raw information, transform it, and output a report or dashboard) the value chain is long, the decision is strategic, and the intuitive answer is not always the right one.

![Data product value chain](/build-order-pipeline.svg)

The prevailing orthodoxy, driven by the Lean Startup movement, argues for Output-Backwards. You start with the customer-facing output (even if you have to fake the data or hand-crank the processing behind the scenes) because this is the fastest route to testing value.

The counter-argument is Input-Forwards: start at the data source, build the pipeline, and let the engineering inform the product. This is more technically intuitive and scales cleanly, but it risks building something nobody wants.

Having tried both approaches, and various combinations of the two, I've learned that treating this as a binary choice is a false dichotomy. The decision isn't technical; it's a question of strategy.

## The strategic context

Before we decide what to build, we have to look at where we are.

If we are at an early stage, our understanding of the market is likely lower than we think. We don't know what we don't know. In this context, as Eric Ries argues, our priority is "validated learning": building an information advantage.

This gets complicated when the need for learning clashes with the need for short-term revenue (survival). Sometimes these goals align; if you generate sales, you have identified a market signal. But not always. Companies that boomed during the dot-com era or the Covid-19 pandemic often mistook a short-term spike for sustainable growth.

If revenue isn't always reliable evidence of product-market fit, we have to fall back on a different principle: aggressively minimising the cost of learning. Any build is a gamble, and we shouldn't walk into a casino with more money than we are willing to lose.

So, if we have finite resources and a goal to learn, how does that dictate our build order?

## The risks of Output-Backwards

The intuition to start with the customer view is strong. It unblocks sales and marketing, and it aligns development to a tangible output.

However, I have observed a specific failure mode with this approach when applied to data products. It is possible to be too successful at fulfilling orders manually.

I have seen teams build a "concierge" MVP, where the software is a shell powered by humans working spreadsheets in the background. The plan is always to "backfill" the automation later. But if sales take off, the internal resources get soaked up managing the manual process. The engineering team is pulled in to fight fires, and the company finds itself without the capacity to invest in the automation required to become profitable. You end up with a business that scales its costs linearly with its revenue.

## The case for Input-Forwards

The alternative is to start at the source: investing in the tooling to automate data acquisition and transformation before worrying about the UI.

The strongest argument for this is capability discovery. The nature of the backend often dictates the nature of the product. If we optimise a data pipeline to run in seconds rather than hours, we haven't just made the product faster; we have changed the kind of product we can sell (e.g., real-time alerting vs. daily reporting).

There is also an asset-value argument. If we build a robust data pipeline, we have created an asset that can serve multiple different UIs. If we build a specific UI for a customer who turns out not to exist, that code is largely wasted.

## Deciding where to start

Ultimately, there is no "right" way, but there are scenarios that favour one direction over the other.

### Scenario 1: the "dead cert" (Input-Forwards)

We believe we have customers lined up, perhaps even signed contracts. The demand seems unequivocal.

In my experience, founders who feel this certainty are usually either very right (the customer has already handed over money) or very wrong (they are misreading the market).

Paradoxically, both situations favour building from the back end. If the founder is right, the customer is usually willing to wait for the product to be ready. If the founder is wrong, and the demand is a mirage, a robust data pipeline is still an asset that can be re-targeted to a different offering. A specific UI built for a phantom customer is a liability.

![Input-Forwards approach](/build-order-input-forwards.svg)

### Scenario 2: the validated need (Output-Backwards)

We have confirmed the customer's unmet needs, and we are confident our data source can address them, but we aren't sure of the exact implementation.

This is the classic case for starting with the customer view. Because we are confident in the "upstream" feasibility, the risk lies in the "downstream" usability. The customer will likely accept hand-cranked outputs because the need is acute, allowing us to refine the interface before committing to the engineering.

![Output-Backwards approach](/build-order-output-backwards.svg)

### Scenario 3: the solution search (the Middle-Out)

We have access to a data source, but we are trying to identify what customer problems it can solve.

In this case, it often makes sense to ignore both the polished UI and the robust automation. The focus should be on the transformation layer: manually acquiring data once, and then rapidly prototyping a wide range of different outputs to see where the value lies.

![Middle-Out approach](/build-order-middle-out.svg)

## Conclusion

"Minimum Viable Product" is a contentious term. Let's consider, for a moment, the original definition: the version of a product which allows a team to collect the maximum amount of validated learning with the least effort.

Sometimes, the "least effort" is a slide deck. Sometimes, it is a Rust-based data ingestion engine. The strategy lies in knowing the difference.
