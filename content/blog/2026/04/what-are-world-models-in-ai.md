---
title: "What Are World Models in AI?"
date: "2026-04-01T17:17:17.522Z"
slug: "2026/04/what-are-world-models-in-ai"
category: 'AI'
tags: ['AI', 'World Model']
keywords: ['AI']
featured: 'images/what-are-world-models-in-ai.png'
---

I’ve been seeing “world models” come up a lot recently and finally spent a bit of time trying to understand what people actually mean by it.
This is mostly me thinking out loud after watching a couple of talks and reading a bit.

## The short version

> A world model is an AI that learns how things change over time, so it can predict what happens next

The bit that helped me was realising this is not just `input -> output`. It’s more like:

* what state are we in
* what probably happens next
* what happens if *I* do something

So the goal is not just to answer. It’s to model the world well enough to simulate outcomes.

## Why it feels different

Most of the AI we use day to day is reactive. You give it something, it gives you something back.

A world model is more about predicting what might happen, trying different options, then choosing an action. That’s why it feels closer to planning than autocomplete.

## The mental model that helped

The thing that made it click for me was games. If you’re playing chess, you’re not just reacting to the current board. 

You’re thinking:

* if I do this
* they’ll probably do this
* then I can do this

You’re simulating a few steps ahead. That’s basically the idea.

```mermaid
flowchart LR
  A[Current state] --> B[World model]
  B --> C[Predict possible futures]
  C --> D[Choose action]
  D --> E[New state]
  E --> B
```

## A more concrete example

Driving is a good one. You *could* build a system that just does `camera input -> steering output`, but that’s quite brittle.

A world model approach is more like:

* learn how cars, roads, and movement behave
* simulate: if I turn here, where am I in 2 seconds?
* pick the safest option

So instead of just reacting, it’s reasoning about outcomes.

## Why this matters

> predicting the next word is not the same as understanding the world

If you only train on text:

* you never see objects
* you never interact with the world
* you never experience cause and effect

So you end up with something that’s very good at language, but not grounded in reality.

## The data comparison is wild

> Large language models are trained on ~10¹⁴ bytes of text, while a 4-year-old has seen ~10¹⁴ bytes of visual data

The model gets good at text but a human understands the physical world. So it’s not just about scale, it’s about *what* you learn and *how* you learn it.

Another useful idea here is that you probably don’t want to predict every tiny detail of the future. You want a simplified model that keeps the bits that matter.

## Where this gets interesting (for me)

The obvious applications are robotics, self-driving, and games, but the one I keep thinking about is coding. Right now AI coding tools mostly read code and predict the next change.

But imagine something that can simulate a system and ask:

* if I change this, what breaks?
* if I move this, what improves?

That feels like a pretty big shift from autocomplete.

## Reality check

The full version of this, proper world models plus planning plus abstraction, doesn’t really exist yet.

There are pieces of it, but the full thing is still very much unsolved.

## Videos

If you want to go deeper:

https://www.youtube.com/watch?v=yUmDRxV0krg
