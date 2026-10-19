---
title: "Apache Localhost Rendering Slowly?"
type: 'post'
date: '2014-11-03T19:39:03.284Z'
slug: '2014/11/apache-localhost-rendering-slowly'
category: 'programming'
tags: ['apache', 'how-to']
summary: "Setting ServerName to 127.0.0.1:80 in httpd.conf can fix an Apache localhost that loads slowly."
featured: 'images/featured-apache-localhost-rendering-slowly.png'
featuredStyle: 'mascot-cartoon'
featuredPalette: 'bright'
featuredPrompt: 'A cute server tower plugs its network cable into a tiny house-shaped port on its own back, then zips ahead with speed lines while a dull hourglass wobbles behind.'
---
Is your localhost taking longer than expected to load?

A possible quick fix is to edit your `httpd.conf` file and set `'ServerName'` to `127.0.0.1:80` . This can make the difference between millisecond load times and crying while Apache tries to load.

```apacheconfig
# ServerName gives the name and port that the server uses to identify itself.
# This can often be determined automatically, but we recommend you specify
# it explicitly to prevent problems during startup.
#
# If your host doesn't have a registered DNS name, enter its IP address here.
ServerName 127.0.0.1:80
```
