---
title: "Autoinstalling .Debs on Firefox"
date: '2009-09-17T21:39:03.284Z'
slug: '2009/09/autoinstalling-debs-on-firefox'
category: 'how-to'
tags: ['how-to', 'linux', 'ubuntu', 'firefox']
keywords: ['debs', 'auto', 'install']
---

I was trying to use a get .debs website the other day and with a lot of frustration of firefox saying `Firefox does not have the correct protocol to open this file [.apt]` I finally figured out that I did not have `apt-url` installed on kUbuntu.

This can be fixed by simply opening a terminal window and typing:
```bash
sudo apt-get install apturl
```
Then restart firefox. Go to download another .deb / .apt file and when it asks you what you would like to use to open the file browse to `/usr/bin` and pick whatever installs your programs.