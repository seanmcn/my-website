---
title: "Ralphex"
type: 'find'
date: "2026-09-05T09:00:00.000Z"
slug: "2026/09/ralphex"
category: 'ai'
tags: ['ai', 'developer-tools', 'automation']
keywords: ['ralphex', 'ai agents', 'claude code', 'codex', 'orchestration']
source: 'https://ralphex.com/'
sourceTitle: 'ralphex.com'
summary: 'A CLI that runs Claude Code or Codex through a plan you write, one fresh session per task, then reviews the result in several rounds.'
margins:
  - label: 'The idea'
    text: 'Each task runs in a fresh session and gets its own commit, then the finished work goes through several rounds of review.'
featured: 'images/featured-ralphex.png'
featuredStyle: 'chibi-cartoon'
featuredPalette: 'bright'
featuredPrompt: 'A baton guides five transparent pods—magnifying glass, wrench, beaker, scissors, and open book—each refining identical blank blocks that flow into a tidy, tabbed paper stack'
---

My friend Anton mentioned this to me. I haven't used it yet, but it looks interesting.

Ralphex is a CLI that runs AI coding agents like Claude Code and Codex through a plan you write, one task at a time. Each task gets a fresh session, so the agent's context doesn't fill up with earlier work, and each one runs your tests and linters and gets its own commit.

Once every task is done, the review happens in rounds. First, five agents review the work in parallel, covering quality, implementation, testing, simplification and documentation, and Claude fixes what they find. Then there's an optional second opinion from GPT-5 via Codex, which repeats until there's nothing left to fix. Last, the quality and implementation agents do a final pass for anything critical. There's also a real-time web dashboard for watching it run.

```mermaid
flowchart TD
  subgraph each [For each task in your plan]
    direction LR
    session[Fresh session] --> checks[Tests and linters] --> commit[Commit]
  end
  subgraph after [Once every task is done]
    direction LR
    review[Five reviewers] --> codex[GPT-5 via Codex] --> final[Final review]
  end
  each --> after
```

The tagline is "Write a plan. Walk away.", and with a commit per task and the review results, you can see what it did while you were gone.
