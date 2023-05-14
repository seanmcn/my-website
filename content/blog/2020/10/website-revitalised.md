---
title: "Website revitalised using Gatsby!"
date: '2020-10-29T02:09:03.284Z'
slug: '2020/10/website-revitalised-gatsby'
category: 'meta'
tags: [ 'programming', 'gatsby', 'javascript']
keywords: ['gatsby', 'reactjs', 'js', 'javascript']
featured: images/cartoon-web-design.png
---
This year, one of my personal goals was to revitalise this website and get the source code onto Github.

Historically it has been a blog, and not that anyone's really noticed, but I haven't done any blogging lately. While I do want to maintain my blog, and I intend on continuing to post to it, I don't think it should be the focus of this website anymore.

Moving forward, I want this website to be somewhere:
- I store technical information that I might need to refer to later.
- I can highlight projects I'm working on & try out new ideas.
- I can blog about different topics easily.

This presented a few issues for me with the websites existing setup:
- It was built on WordPress, which I didn't find very motivating to develop on anymore.
- It was self-hosted on a server that included websites for family & friends. This made me hesitant to install new tools or languages on the server.
- The existing UI/UX of the website didn't cater to most of what I had in mind.

Naturally, I concluded the best course of action was to start from scratch—the sort of decision you can easily take on a project that's entirely your own.

I had recently started to use ReactJS on a few projects at Kobas and was enjoying using it, so I decided I would use that for the frontend. I also knew I wanted to utilise some form of auto-deployment for the project, as that makes development much more comfortable.

After several iterations of trying different JAMstack frameworks, I landed on [Gatsby](https://www.gatsbyjs.com/) hosted on [AWS Amplify](https://aws.amazon.com/amplify).

I started the project using the "[Gatsby WordPress starter](https://www.gatsbyjs.com/starters/GatsbyCentral/gatsby-starter-wordpress)", immediately giving me a ReactJS frontend with the data sourced from my existing WordPress instance.

This allowed me to quickly get to a point where I could work on the design using real data and recognise the functionality I needed to code myself. While I did have data sourced from WordPress, I didn't have a comment system, contact page, search, or sidebar widgets for things like tags/categories.

I needed to decide what I didn't immediately require, as I wanted to get the new version out as soon as possible. A design I was happy with was the first thing to get added to my MVP list. The sidebar widgets I considered design-related, the website looked bare without them, they went into my MVP list. The contact page also went onto the MVP list, mainly as it was trivial to add utilising [getform.io](https://getform.io).

I decided that I could live without a comment system, it had never gotten much engagement anyway. I also thought that if I wanted one later, I could use something like Disqus. Adding search functionality seemed the most complex out of the features I was missing, so I didn't add it to the MVP list.

Over the next few weeks, I worked on the above MVP list. Doing my best to avoid adding more functionality along the way.

Once I was done with the MVP list, I started looking at deployment options. I wanted something I wouldn't need to spend much time configuring. [AWS Amplify](https://aws.amazon.com/amplify) fit that requirement. First, I moved my domain over to [Route53](https://aws.amazon.com/route53/). Then I pointed Amplify to [my Github repository](https://github.com/Seanmcn/my-website/), which automatically picked up the build command in my package.json. So simple!

I'm pretty happy where I've got to at this point, any future development I want to do here is much more streamlined for me. More fun stuff to come I hope. :grinning: