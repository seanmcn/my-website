---
title: "Apache Localhost Rendering Slowly?"
date: '2014-11-03T19:39:03.284Z'
slug: '2014/11/apache-localhost-rendering-slowly'
tags: ['apache', 'programming']
category: 'programming'
---
![Slowweb-2.jpg](images/Slowweb-2.jpg)
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