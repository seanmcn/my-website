---
title: "Building Chinwag: Local-First WhatsApp Chat Analysis in Go"
date: "2026-04-07T09:31:11.746Z"
slug: "2026/04/chinwag"
category: 'programming'
tags: ['text-analysis', 'go', 'whatsapp', 'open-source']
keywords: ['chinwag', 'whatsapp chat analysis', 'go app', 'local first', 'text analysis']
featured: 'images/featured-chinwag.png'
---

Recently, I have been working on [Chinwag](https://github.com/seanmcn/chinwag), a local-first tool for analysing exported WhatsApp chats and turning them into an interactive breakdown of how two people actually communicate.

What interested me about this is that chat apps give you plenty of history, but very little structure. You can scroll through years of messages and still not get a clear picture of the patterns underneath the conversation. Who usually starts things? Who replies faster? Who carries the exchange when energy drops? Which words or moods show up more for one person than the other?

That is the sort of thing I wanted Chinwag to surface.

## What Chinwag Does

At its core, Chinwag is a Go application that parses the raw WhatsApp export file and converts it into a structured timeline of messages. Once it has that timeline, it runs a series of lightweight analysis passes over the data to surface patterns and behaviours.

It looks at things like:

- conversation dynamics, such as who starts, who replies, and who lets threads die
- response times and latency patterns, including averages, streaks, and burstiness
- message balance and reciprocity
- topic extraction using a TF-IDF-style approach to highlight distinctive words per person
- sentiment and emotional tone using lexicon-based scoring
- behavioural signals like questions, encouragement, apologies, and laughter

The goal is not just to dump out metrics. I wanted to build a lightweight analysis pipeline that turns chat logs into something human-readable and a bit more revealing. Rather than simply saying one person sent 53% of the messages, Chinwag tries to show what that means in practice.

Under the hood, the NLP side is still deliberately pragmatic. Topic extraction uses a simple term-frequency style approach with stopword filtering rather than anything model-based. The stopword base comes from [NLTK's English stopwords corpus](https://www.nltk.org/howto/corpus.html), with some chat-specific additions layered on top. For sentiment, I moved away from a tiny hand-rolled positive and negative word list and toward a [VADER](https://github.com/cjhutto/vaderSentiment) style scorer implemented directly in Go. That means the tone is not just based on word matches, but also on things like negation, degree modifiers, capitalised emphasis, and punctuation.

On top of that, Chinwag now uses the [NRC emotion lexicons](https://nrc.canada.ca/en/research-development/products-services/technical-advisory-services/sentiment-emotion-lexicons) for emotion, intensity, and VAD scoring. So instead of only asking whether a message is broadly positive or negative, it can also look at whether the chat leans more toward joy, anger, trust, fear, or surprise, how emotionally intense a stretch of conversation is, and whether the overall tone feels calmer or more high-energy.

## Why I Built It

I was partly inspired by [Mimoto Messages Analyzer](https://apps.apple.com/gb/app/mimoto-messages-analyzer), but I also wanted to build something that was a bit more transparent in how it worked and more in line with the kind of software I enjoy making.

Back when I was at UBC, I did some basic text analysis work, and I liked the idea of applying that sort of thinking to something much more personal and conversational. WhatsApp exports are messy, informal, and full of small behavioural tells, which makes them a fun input for lightweight analysis.

It also turned into a useful engineering constraint. I wanted to build something practical on messy conversational text without defaulting to heavyweight models or external services.

## Local-First by Design

One of the main constraints I set from the beginning was that everything had to run locally.

Chinwag does not use heavy machine learning models or external APIs. Instead, it relies on simple heuristics, precomputed lexicons, and fast scoring passes that can run directly on your own machine. The lexicon data is bundled with the app as local assets, loaded into Go maps at runtime, and then reused across the analysis pipeline. That keeps it quick, cheap, and private.

Your chat data does not need to be uploaded anywhere, indexed by a third party, or fed into someone else's service. You export the chat, point Chinwag at it, and it generates the analysis locally.

That local-first approach shaped the whole project. It pushed me toward methods that are understandable, fast, and easy to reason about, which I think suits this kind of tool far better than throwing a giant model at it.

It also forced a few design decisions I am quite happy with. The runtime stays pure Go, there is no Python dependency in production, and all of the NLP resources can be shipped as compact JSON files or embedded assets. That keeps the whole thing straightforward to distribute while still being expressive enough to produce results that feel right on casual chat data.

## A Bit More on the Tech

The analysis pipeline works message by message. First the parser normalises the chat export into a timeline with authors, timestamps, message kinds, and body text. From there, Chinwag tokenises each message and runs a few separate scoring passes over the same text.

One pass computes [VADER](https://github.com/cjhutto/vaderSentiment) style sentiment and produces a compound score between -1 and +1. Another maps words into [NRC](https://nrc.canada.ca/en/research-development/products-services/technical-advisory-services/sentiment-emotion-lexicons) emotion categories such as joy, sadness, anger, trust, and anticipation. Another layer adds intensity weighting, while the VAD lexicon provides a rough read on valence, arousal, and dominance.

Those message-level scores are then aggregated per participant and over time. That is how Chinwag can surface things like average tone, emotional distribution, intensity peaks, energy level, and broader relationship patterns instead of stopping at raw counts.

I like this setup because it gives a lot of mileage from relatively small building blocks. It is not trying to be academic NLP, and it is definitely not pretending to "understand" a relationship in any deep sense. It is just a fast local pipeline that can take messy conversational text and produce results that feel useful without being expensive or opaque.

## The Output

Chinwag is available as a desktop app for macOS and Windows, with a CLI as well for anyone who wants to script against it or inspect the raw output.

Once a chat has been processed, you get a dashboard showing the relationship from a few different angles: volume, pacing, tone, topic signals, and conversation flow. The interesting part, to me at least, is seeing how quickly raw text can be normalised, scored, aggregated, and turned into something legible.

There is no account system, no database, and no tracking layer bolted on top. It is just a tool that reads your export, computes insights, and presents them back to you in a form that is easy to explore. Some of those insights are deliberately simple, who starts more conversations, who replies faster, who asks more questions, while others now lean more on the upgraded scoring layer, such as emotional intensity, joy versus anger, trust signals, and overall chat energy.

## Closing Thoughts

I like projects like this because they sit in a nice middle ground between engineering and curiosity. The technical work is enjoyable, parsing exports, building scoring passes, shaping the UI, but the more interesting part is what falls out when you run those systems over real communication data.

Chinwag is open source, and if you want to take a look or try it yourself, the code is on [GitHub](https://github.com/seanmcn/chinwag).
