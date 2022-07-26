---
title: "Google Delivers New Java-like Language: Noop"
date: '2009-09-23T01:39:03.284Z'
slug: '2009/09/google-delivers-new-java-like-language-noop'
category: 'programming'
tags: [ 'google', 'java', 'noop', 'programming']
keywords: ['new', 'language']
---

The developers over at Google have come up with Noop, a new language that runs on the Java Virtual Machine.

> "Noop (pronounced 'noh-awp,' like the machine instruction) is a new language that attempts to blend the best lessons of languages old and new, while syntactically encouraging industry best-practices and discouraging the worst offenses," according to a description of the language on the Noop language Website.
>
> Noop supports dependency injection in the language, testability and immutability. Other key characteristics of Noop, according to the Noop site, include the following: "Readable code is more important than any syntax feature; Executable documentation that's never out-of-date; and Properties, strong typing, and sensible modern stdlib."

I suppose your thinking why another language? Google explain this:
>Our experience has been that developers often create code that's hard to test and maintain, without realizing it. On a large software project, this can create problems later on for the whole team. In analyzing this problem, we found that the root cause in many cases was language features - like globally visible state, misused subclassing, and API's that are easily misused. Noop will try to avoid these problems.

Noop avoids these problems by being opinionated, meaning it pushes you toward using good practices while developing software. It does this by;

| Noop saying Yes to                                              | Noop saying No to                        |
|:----------------------------------------------------------------|:-----------------------------------------|
| Dependency injection built into the language                    | Any statics whatsoever                   |
| Testability - a seam between every pair of classes              | Implementation inheritance (subclassing) |
| Immutability                                                    | Primitives                               |
| Syntax geared entirely towards readable code                    | Unnecessary boilerplate                  |
| Executable documentation that's never out-of-date               |                                          |
| Properties, strong typing, and sensible modern standard library |                                          |

I'm still only learning Java myself, have to this year with the course. But I hope to mess around with Noop sometime soon in the future!