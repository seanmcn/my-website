---
title: "MinFeed"
slug: "min-feed"
summary: "A minimal, AI-powered RSS reader that deduplicates stories and filters noise to surface what matters."
date: "2026-01-04"
language: "TypeScript"
repo: "https://github.com/seanmcn/min-feed"
techStack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "Radix UI", "AWS Amplify Gen 2", "AWS Lambda", "DynamoDB", "AppSync", "OpenAI"]
tags: ["rss", "ai", "news"]
featured: "images/main-mobile.png"
gallery:
  - image: "images/main-desktop.png"
    alt: "Main feed (desktop)"
  - image: "images/main-mobile.png"
    alt: "Main feed (mobile)"
  - image: "images/fitlers-mobile.png"
    alt: "Filters"
  - image: "images/rss-sources.png"
    alt: "RSS sources"
  - image: "images/user-settings.png"
    alt: "User settings"
---

MinFeed is an experiment in making RSS feel useful again without recreating the clutter of modern news feeds.

The main idea is to take a set of feeds, collapse duplicate coverage, and reduce the amount of repeated noise so that the more interesting stories rise to the surface. It sits somewhere between a traditional RSS reader and a summarisation tool, but the aim is still to preserve the control and openness that make RSS appealing in the first place.

I am particularly interested in products like this because they touch on a problem that is now very common: there is no shortage of information, but there is a shortage of signal. A smaller, more deliberate feed often ends up being more useful than a larger, noisier one.

Each article is run through an AI pass that classifies it by category (world, tech, programming, science, business, sport, gaming, entertainment), tags it with sentiment and a 0–100 importance score, and writes a short TL;DR alongside a "why it matters" line. Stories that show up across multiple sources are grouped together so the same headline doesn't appear five times in a row. On top of that there are the usual filters for sentiment, category, and blocked keywords, plus a hide control for individual articles.

The reading experience is deliberately keyboard-first. `j` and `k` move between articles, `o` or Enter opens the current one, `m` marks as read, and `?` brings up the full shortcut list. Articles dim once you've opened them so it's obvious where you got to.

Sources are split into a curated set of system defaults (Hacker News, BBC News, BBC Technology, a couple of Reddit tech subs) and up to three custom feeds per user. Failing sources auto-disable themselves and surface their error state, and individual sources can be toggled without removing them entirely.

Technically it runs on AWS Amplify Gen 2. The frontend is React with Vite, Tailwind, Zustand for state, and Radix UI primitives. The backend is a set of Lambda functions sitting on top of DynamoDB and AppSync — an RSS poller that fetches and deduplicates feeds, an AI processor that handles classification and summarisation through GPT-4o-mini in batches, a content enricher built on Mozilla Readability for full-article extraction, plus smaller functions for feed previews, source seeding, and TTL cleanup. Running it for personal use (around 100 articles a day) costs less than a dollar a month, mostly OpenAI tokens.
