---
title: "Steady Days"
slug: "steady-days"
summary: "A SwiftUI iOS app for tracking habit-breaking streaks, daily check-ins, and recovery progress, with support for quitting, reducing, or pausing any habit."
date: "2026-03-24"
language: "Swift"
demo: "https://steady-days.com"
techStack: ["Swift", "SwiftUI", "SwiftData", "iOS", "GitHub Actions", "TestFlight"]
tags: ["ios", "habits", "health", "personal-app"]
featured: "images/featured.png"
gallery:
  - image: "images/dashboard-dark.png"
    alt: "Dashboard (dark)"
  - image: "images/dashboard-light.png"
    alt: "Dashboard (light)"
  - image: "images/insights-dark.png"
    alt: "Insights (dark)"
  - image: "images/insights-light.png"
    alt: "Insights (light)"
  - image: "images/reduce-dark.png"
    alt: "Reduce goal (dark)"
  - image: "images/reduce-light.png"
    alt: "Reduce goal (light)"
---

Steady Days is an iOS app for tracking habit-breaking streaks and recovery progress. It is designed for people who want to quit, reduce, or take a structured break from a habit — smoking, vaping, alcohol, gaming, or anything custom — without the gamified guilt of most habit trackers.

The core loop is a daily check-in: log your mood, any triggers, and your status across every habit you are working on, all in one flow. From that, the app builds streaks, week-over-week trends, trigger frequency analysis, and money-saved calculations based on your baseline spending.

There are three goal types depending on what you actually want to do:

- **Quit** tracks pure abstinence streaks.
- **Reduce** tracks usage against a baseline so progress is visible even when you slip.
- **Pause** is a time-limited break with a progress bar.

It is built in pure SwiftUI with SwiftData for persistence — no external dependencies. The data layer is a small set of models with cascade relationships, and the business logic lives in stateless calculation functions so it is easy to test and reason about.
Privacy was a hard requirement: optional Face ID/passcode lock, and optional iCloud sync to the user's own private account — nothing leaves the device unless they want it to. CI/CD pushes to main run a GitHub Actions workflow that builds, archives, and uploads to TestFlight automatically.

It is private source, available on iOS.
