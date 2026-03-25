---
title: "Multitasking Like a Pro: Claude Code, Git Worktrees, and Docker"
date: '2025-07-23T14:30:00.000Z'
slug: '2025/07/claude-code-git-worktrees-docker'
category: 'workflow'
tags: ['ai', 'git', 'docker', 'workflow', 'productivity']
keywords: ['claude code', 'git worktrees', 'docker', 'multitasking', 'development workflow', 'ai coding']
featured: 'images/claude-code-workflow.png'
---

As developers, we've all been there—you're deep in fixing a critical bug when suddenly a urgent feature request lands on your desk. Context switching between branches, stashing changes, and trying to keep multiple workstreams in your head can be mentally exhausting. Over the past few months, I've discovered a workflow that's completely transformed how I handle multiple concurrent tasks: combining [Claude Code](https://claude.ai/code) with [git worktrees](https://git-scm.com/docs/git-worktree) and [Docker](https://www.docker.com/).

## The Problem with Traditional Branch Switching

The traditional git workflow of switching branches works fine for sequential development, but it falls apart when you need to work on multiple features simultaneously. Stashing changes, switching contexts, and losing your mental model of what you were working on creates friction that compounds throughout the day.

I used to juggle multiple terminal tabs, trying to remember which branch had what changes, often losing track of my progress. Sound familiar?

## Enter Git Worktrees

Git worktrees allow you to check out multiple branches simultaneously in separate directories. Instead of switching branches, you simply switch directories. Each worktree maintains its own working directory and index, meaning you can have multiple branches checked out at once without any conflicts.

Here's my typical setup:

```bash
# Create worktrees for different features
git worktree add ../myproject-feature-auth feature/user-authentication
git worktree add ../myproject-hotfix-db hotfix/database-connection
git worktree add ../myproject-main main
```

This gives me three separate directories:
- `myproject-main/` - for the main branch
- `myproject-feature-auth/` - for the authentication feature
- `myproject-hotfix-db/` - for the database hotfix

Each directory is a complete working tree with its own branch checked out.

## Docker: Consistent Environments Across Worktrees

The beauty of combining worktrees with Docker is that each worktree can run its own containerized environment. No more worrying about dependency conflicts or environment inconsistencies between different branches.

In each worktree directory, I can spin up independent Docker containers:

```bash
# In myproject-feature-auth/
docker-compose up -d

# In myproject-hotfix-db/
docker-compose up -d --project-name myproject-hotfix
```

The `--project-name` flag ensures Docker treats each worktree as a separate project, avoiding port conflicts and container naming issues.

## Where Claude Code Fits In

This is where [Claude Code](https://claude.ai/code) becomes a game-changer. Having multiple isolated environments means I can have Claude Code assist with different tasks in parallel without losing context.

### Scenario 1: Bug Fix While Feature Development

I'm working on a new authentication system in one worktree when a critical database connection issue is reported. Instead of stashing my auth work:

1. Switch to the hotfix worktree: `cd ../myproject-hotfix-db`
2. Fire up Claude Code in that directory
3. Claude Code understands the context of the hotfix branch immediately
4. Work with Claude to identify and fix the database issue
5. Deploy the fix while keeping my auth feature work untouched

### Scenario 2: Code Reviews and Refactoring

When reviewing a colleague's pull request, I can create a temporary worktree:

```bash
git worktree add ../myproject-review feature/colleague-work
cd ../myproject-review
```

Claude Code can help me understand the changes, suggest improvements, or even help write comprehensive review comments—all while my main development work continues uninterrupted in other worktrees.

## My Current Workflow

Here's how a typical day looks with this setup:

**Morning Setup:**
```bash
# Main development work
cd ~/projects/myproject-main
claude-code

# Feature branch in separate terminal
cd ~/projects/myproject-feature-xyz
claude-code
```

**When a hotfix is needed:**
```bash
git worktree add ../myproject-hotfix-urgent hotfix/urgent-fix
cd ../myproject-hotfix-urgent
docker-compose up -d --project-name hotfix-urgent
claude-code
```

Each Claude Code session maintains context for its specific worktree and branch, making recommendations that are relevant to that particular codebase state.

## Benefits I've Experienced

**Mental Context Preservation:** No more losing track of what I was working on. Each worktree maintains its own state, and Claude Code maintains its own understanding of each context.

**Reduced Context Switching:** Instead of mentally switching between different features, I physically switch directories. Claude Code in each directory "remembers" what we were working on.

**Parallel Development:** I can literally work on multiple features simultaneously, with Claude Code assisting in each environment independently.

**Testing Isolation:** Each worktree can run its own test suite and Docker environment without interference from other work.

## Costs and Considerations

The main downside is disk space—each worktree is a complete copy of your repository. For large repositories, this can add up quickly. A typical project might consume 2-3x more disk space, but storage is cheap compared to developer productivity.

There's also a slight learning curve with managing multiple worktrees, but the `git worktree list` command helps you keep track of what's checked out where.

## Closing Thoughts

This workflow has fundamentally changed how I approach development work. The combination of git worktrees providing isolated branches, Docker ensuring consistent environments, and Claude Code maintaining context-aware assistance across multiple workstreams has eliminated much of the friction from multitasking.

The setup takes a few minutes to establish, but the productivity gains are immediate. If you find yourself frequently context-switching between different features or struggling to maintain focus across multiple development streams, I highly recommend giving this workflow a try.

The tools are all free (except for Claude Code's subscription), and the mental relief of not having to juggle multiple contexts in your head is worth the small investment in setup time.