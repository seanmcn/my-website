---
title: "Building Chinwag, a WhatsApp Chat Analyser"
type: 'post'
date: "2026-04-07"
slug: "2026/04/chinwag"
category: 'programming'
project: 'chinwag'
tags: ['text-analysis', 'go', 'whatsapp', 'open-source']
featured: 'images/featured-chinwag.png'
summary: 'Parsing WhatsApp exports into a timeline, running lexicon-based sentiment over it, and keeping every byte on your own machine.'
margins:
  - label: 'In one line'
    text: 'Messy conversational data made legible without any of it leaving the machine.'
  - label: 'Deliberately unfashionable'
    text: 'Lexicons and heuristics instead of models: VADER-style sentiment, TF-IDF topics, NRC emotion.'
---


[Chinwag](/projects/chinwag/) is a tool I've built for analysing exported WhatsApp chats. You give it the export file and it shows you how the two people in the chat actually talk to each other: who usually starts conversations, who replies faster, who keeps things going when the energy drops, and which words and moods show up more for one person than the other.

It's [open source](https://github.com/seanmcn/chinwag), runs as a desktop app on macOS and Windows (there's a CLI too), and never sends your messages anywhere. There are no machine learning models or external APIs involved either. The analysis is all word lists and heuristics, which I've found is enough to get results that feel right on casual chat.

## Why I built it

Chat apps keep years of history but give you almost no structure. You can scroll back through all of it and still not see the patterns underneath the conversation.

I was partly inspired by [Mimoto Messages Analyzer](https://apps.apple.com/us/app/mimoto-messages-analyzer/id6739403565?mt=12), a Mac app along the same lines, but I wanted something more transparent about how it works and closer to the kind of software I enjoy making.

Back when I worked at UBC, I did some [basic text analysis](/projects/open-collections-ipython-notebooks/) on their Open Collections archives, and I liked the idea of pointing that sort of thinking at something much more personal. WhatsApp exports are messy, informal and full of small behavioural tells, which makes them a fun thing to analyse.

I also gave myself a constraint: build something useful on messy conversational text without reaching for heavyweight models or someone else's service.

## What it measures

Chinwag is written in Go. It parses the raw export into a timeline of messages, then runs a series of lightweight analysis passes over it. Between them, those passes look at:

- conversation dynamics, like who starts, who replies, and who lets threads die
- response times, including averages, streaks, and burstiness (how much the replies come in quick clusters)
- message balance and reciprocity
- the words each person uses more than the other
- sentiment and emotional tone
- behavioural signals like questions, encouragement, apologies, and laughter

I wanted the result to say more than a pile of metrics would. Knowing one person sent 53% of the messages doesn't tell you much by itself, so Chinwag tries to show what that looks like in practice: who's starting the conversations, who's answering them, and how the tone differs between the two of you.

## How the scoring works

First the parser normalises the export, so every message has an author, a timestamp, a message kind and its body text. Chinwag then tokenises each message (splits it into words) and runs a few separate scoring passes over the same text.

Topics use a TF-IDF-style approach, with no model involved. TF-IDF scores a word higher the more one person uses it, and lower the more common it is across the whole chat, so each person's distinctive words float to the top. Before that, it filters out stopwords (filler like "the" and "and") using [NLTK's English stopwords list](https://www.nltk.org/howto/corpus.html), with some chat-specific additions of my own.

Sentiment started out as a tiny hand-rolled list of positive and negative words. I replaced it with a [VADER](https://github.com/cjhutto/vaderSentiment)-style scorer written directly in Go. VADER is a rule-based sentiment scorer designed for social media text, so as well as matching words it accounts for negation ("not good"), degree modifiers ("very good"), capitalised emphasis and punctuation. Each message gets a compound score between -1 and +1.

Emotion comes from the [NRC emotion lexicons](https://nrc.canada.ca/en/research-development/products-services/technical-advisory-services/sentiment-emotion-lexicons), word lists published by the National Research Council of Canada. One maps words to emotions such as joy, sadness, anger, fear, trust, surprise and anticipation. Another adds intensity weighting, and the VAD lexicon gives a rough read on valence (how pleasant), arousal (how energetic) and dominance (how in control). With those, Chinwag can tell you whether a chat leans towards joy or anger, how intense a stretch of conversation got, and whether the overall tone is calm or high-energy, where VADER on its own only gets you positive or negative.

Those message-level scores are then added up per person and over time. That's where the average tone, emotional distribution, intensity peaks and energy levels come from.

I like this setup because it gets a lot of mileage out of small building blocks. It isn't academic NLP, and it definitely doesn't "understand" a relationship in any deep sense. It's a fast local pipeline that takes messy text and produces results that feel useful, and you can always see why it scored something the way it did.

## Keeping it local

Everything had to run locally from the start. You export the chat from WhatsApp, point Chinwag at it, and the analysis happens on your machine. Your messages don't get uploaded or fed into anyone else's service, and there's no account, database or tracking.

That constraint shaped most of the project. The lexicons ship with the app as compact JSON files or embedded assets, get loaded into Go maps at runtime, and are reused across every pass. The runtime is pure Go with no Python dependency in production, which keeps it quick and easy to distribute. It also pushed me towards methods that are fast and easy to reason about, and I think that suits this kind of tool far better than throwing a giant model at it.

## What you get

Once a chat's processed, the desktop app shows a dashboard that looks at the conversation from a few angles: volume, pacing, tone, topics and conversation flow. Some of it is deliberately simple (who starts more conversations, who replies faster, who asks more questions). The rest leans on the scoring above, like emotional intensity, joy versus anger, trust signals and overall energy. The CLI is there if you'd rather script against it or dig through the raw output.

I enjoy projects like this because they sit somewhere between engineering and curiosity. Parsing exports, building scoring passes and shaping the UI was fun, but the more interesting part is what falls out when you run them over real conversations. The code is on [GitHub](https://github.com/seanmcn/chinwag) if you want to try it on your own chats.
