---
title: "Google Delivers New Java-like Language: Noop"
type: 'post'
date: '2009-09-23T01:39:03.284Z'
slug: '2009/09/google-delivers-new-java-like-language-noop'
category: 'programming'
tags: ['google', 'java', 'noop']
summary: "Google's Noop, a new language for the Java Virtual Machine that bans statics and subclassing and builds dependency injection into the language."
featured: 'images/featured-google-delivers-new-java-like-language-noop.png'
featuredStyle: 'mascot-cartoon'
featuredPalette: 'bright'
featuredPrompt: 'A cute Noop code-file, with a simple face and tiny arms, rides a virtual-machine cart, snapping puzzle-piece modules together while sweeping tangled wires and a teetering block tower aside.'
---

The developers over at Google have come up with Noop, a new language that runs on the Java Virtual Machine. It's pronounced "noh-awp", like the machine instruction, and the Noop website describes it as "a new language that attempts to blend the best lessons of languages old and new, while syntactically encouraging industry best-practices and discouraging the worst offenses".

I suppose you're thinking, why another language? Google explain it like this:

> Our experience has been that developers often create code that's hard to test and maintain, without realizing it. On a large software project, this can create problems later on for the whole team. In analyzing this problem, we found that the root cause in many cases was language features - like globally visible state, misused subclassing, and API's that are easily misused. Noop will try to avoid these problems.

Noop avoids these problems by being opinionated, meaning it pushes you toward using good practices while developing software. It does this by saying yes to some things and no to others:

| Yes to                                                          | No to                                    |
|:----------------------------------------------------------------|:-----------------------------------------|
| Dependency injection built into the language                    | Any statics whatsoever                   |
| Testability - a seam between every pair of classes              | Implementation inheritance (subclassing) |
| Immutability                                                    | Primitives                               |
| Syntax geared entirely towards readable code                    | Unnecessary boilerplate                  |
| Executable documentation that's never out-of-date               |                                          |
| Properties, strong typing, and sensible modern standard library |                                          |

I'm still only learning Java myself (I have to this year for my course), but I hope to mess around with Noop sometime soon!
