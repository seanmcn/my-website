---
title: "My Development Workflow in 2024"
date: '2024-11-09T13:21:42.341Z'
slug: '2024/11/my-development-workflow'
category: 'workflow'
tags: ['ai', 'php', 'phpstorm', 'game development', 'python', 'godot']
keywords: ['developer', 'workflow', 'cursor', 'ai coding', 'hosting']
featured: 'images/cartoon-dev-workflow.png'
---

Watching my development workflow evolve over the years has been quite a journey. The year 2024 has been no exception, introducing various tools and practices that have reshaped how I code and deploy projects. Here's a glimpse into what my workflow looks like today.

## Dockerizing PHP & GoLang Development

I've fully embraced Docker containers for all my PHP and GoLang development. This shift has streamlined my workflow immensely, providing a consistent environment that's easy to manage and replicate across different projects. While I haven't transitioned all my production environments to Docker yet—mainly because it's a time investment I'm not eager to make, the groundwork is there. 

If any of my production apps reach the point where autoscaling becomes necessary, I'm ready to dive into Argo CD and Kubernetes. My familiarity with these tools means that scaling up will be manageable, especially now that Dockerfiles are a staple in my development process.

When it comes to IDEs, I remain loyal to PHPStorm and GoLand. Despite the hype around VS Code, it doesn't quite measure up for PHP and Go development. The specialized features and integrations in PHPStorm and GoLand make life easier.


## Utilising AWS Amplify in Front-End Development

On the JavaScript and front-end side, AWS Amplify has stolen my heart. It allows me to build and deploy websites that are not only lightning-fast but also incredibly cost-effective. Take this website, for instance—it costs me around $2-3 a month to host. 

A word of caution, though: if you're building and debugging a lot, those costs can creep up slightly since AWS also charges for build time. But even then, we're talking an extra $1-2—not exactly breaking the bank.

As for my IDE choices, I've juggled between VS Code and Cursor. However, now that WebStorm is free for non-commercial use, I'm considering switching. It's hard to say no to a powerful tool that's suddenly free.

## Exploring Machine Learning with Python

Python continues to be a trusty companion in my toolkit. Recently, I've been diving into machine learning using libraries like NumPy, SciPy, and scikit-learn. It's been fascinating to explore this field and see what's possible.

For these projects, PyCharm Community Edition has been my go-to IDE. It has all the features I need without any unnecessary fluff. Additionally, Python remains my language of choice for scripting and automating small tasks. Just the other day, I whipped up a script to sync data from Todoist to Obsidian.

## Venturing into Game Development with Godot

Game development has always been a dream of mine—a nod to why I got into programming in the first place. I started experimenting with GameMaker, and while it was decent, something didn't quite click. Then I discovered Godot, and it's been a game-changer (pun intended). Godot's simplicity and straightforwardness have made the learning curve enjoyable, and I'm excited to see where this side project takes me.

## Integrating AI into Everyday Development

Artificial intelligence has woven itself into nearly every aspect of my workflow. Tools like Cursor are fantastic for adding features or refactoring existing codebases with minimal hassle. ChatGPT, on the other hand, is brilliant for generating default setups for prototypes, saving me heaps of time.

I've also been exploring local AI models. Using Ollama and OpenWebUI, I've set up a ChatGPT-like interface with models like Llama 3.2:3b. While they're not as polished or fast as GPT-4 or Claude, they're surprisingly competent. I've been trying to rely more on these local models, turning to GPT-4 or Claude only when necessary.

Some believe AI is mostly hype, but recent advancements have been remarkable. It is becoming more beneficial than not. When we view AI as an "assistant" rather than a "replacement," it is a valuable ally in the development process.

Working with AI feels like collaborating with a junior developer who somehow knows everything but occasionally slips up on some basics. As long as you review the output and actually understand what it's changing rather than blindly accepting its responses, it works very well. It's all about leveraging the AI's strengths while compensating for its weaknesses, ultimately enhancing productivity and code quality.

## Hosting Preferences: DigitalOcean Over AWS

When it comes to hosting, DigitalOcean Droplets remains my top choice. Despite my appreciation for AWS Amplify on the front end, the rest of AWS's pricing structure feels steep compared to what DigitalOcean offers. Services like databases have become particularly pricey on AWS. A simple setup—including a database, web server, and Redis—that runs smoothly on a $10 DigitalOcean Droplet could cost you anywhere from $30-40 on AWS, mainly because you're paying for each service separately.

DigitalOcean also offers managed services, but I feel that the pricing for these has become somewhat insane—especially for someone who can manage servers themselves. The trade-off with DigitalOcean is that I have to handle more aspects on my own, but for me, the control and cost savings are worth the extra effort. Even DigitalOcean's managed options, like Kubernetes, can get pricey for smaller projects. However, being able to bundle services on a single droplet provides a level of affordability and simplicity that AWS doesn't match for my needs.

## Closing Thoughts

Reflecting on my workflow in 2024, it's clear that embracing new tools and technologies has been essential to staying efficient and passionate about development. Whether containerizing environments with Docker, harnessing the power of AI, or venturing into game development with Godot, each step has been an exciting addition to my journey as a developer.

Here's to continuous learning and the ever-evolving landscape of technology!