---
title: "A demi-decade at Kobas"
date: "2021-06-08T19:39:19.327Z"  
slug: "2021/06/demi-decade-at-kobas"  
category: "work"  
tags: ["php","programming"]  
keywords: ["epos", "hospitality", "demi-decade", "remote work", "kobas"]
---

As of last Sunday, I've been working at [Kobas](https://www.kobas.co.uk/) for five years (a demi-decade :sweat_smile:) , reading [my post from a month in](https://seanmcn.com/blog/2016/07/first-month-at-kobas/) reminds me how much has changed and prompted me to provide an update.

**Job Role**

My job role has changed significantly throughout my time at Kobas. Initially, I was feature-focused and spent all my time programming. As time passed, I became more involved with bug fixes and technical product management: planning features, evaluating APIs and implementing technologies. We've also expanded our team along the way, so I've experienced our onboarding process from both sides. :laughing:

**Issue Management**

Previously we were using [Pivotal Tracker](https://www.pivotaltracker.com/) for our issue management, while it did work great for planning features, it was lacking in terms of bug management. I worked on moving us over to [YouTrack](https://www.jetbrains.com/youtrack/), which at the time required utilising both the Pivotal Tracker export API and the YouTrack API (a fun task :grin:). YouTrack has worked great for us so far, we use their Agile Boards for sprints, project planning and issue triage.

**Working Location**

COVID-19 isn't something I've posted about on here yet, which is strange considering that's been the main subject of the past year. Before COVID-19, Kobas was hybrid-remote, having staff members working from home a certain % of the week, but still maintaining an office that could host all our staff members.

We've now transitioned to being completely remote, which I prefer. I've found [GitLab guide on remote work](https://about.gitlab.com/company/culture/all-remote/guide/) fantastic for resources surrounding working remotely. Overall, I think our transition to remote work has gone smoothly as we already had a lot of technology in place to support remote work (like a VPN).

**Features**

We've made some impressive stuff for our clients since my last post, too much to really talk about without this becoming a changelog. The most recent thing that comes to mind is the [Customer Interaction Centre](https://www.kobas.co.uk/products/customer-interaction-centre/), providing our clients with a way to support online ordering.

Other projects that come to mind when I think of my time here are: [integrating PDQ terminals](https://www.kobas.co.uk/blog/march-madness-pdq-edition/) using socket connections (much fun), rewriting our stock system to support [FIFO](https://www.kobas.co.uk/blog/stock-project-update-first-in-first-out-fifo/) (not fun), and moving our API authentication over to OAuth 2.0 (easier to support third-party integrations).

**Upgrades**

We like to keep all our technology up to date in Kobas, and the last five years has seen a lot of upgrades.

Our back-end now runs on PHP 7.4 (currently working on upgrading to PHP 8) with CentOS 8 Stream as the OS. Our main framework is [Symfony 5](https://symfony.com/), after a lot of work migrating from [Silex](https://silex.symfony.com/). :grimacing:

On the front-end, we've added [ReactJS](https://reactjs.org/) into the mix, and new projects are now done in that. Lastly, on the automated testing front, we are still using [Codeception](https://codeception.com/) but are moving our acceptance tests to [Cypress](https://www.cypress.io/).

**Future**

As evidenced by this year, it's impossible to know what the future holds. But I hope to be able to post more about the work I'm doing at Kobas on here, as I'm aiming to add more [open source projects](https://github.com/KOBASSoftware/). Stay tuned. :wink: