---
title: "Earcandy in Ubuntu Jaunty"
type: 'post'
date: '2009-09-28'
slug: '2009/09/earcandy-in-ubuntu-jaunty'
category: 'systems'
tags: ['how-to', 'linux', 'ubuntu']
summary: "Installing EarCandy on Ubuntu Jaunty from its PPA, a PulseAudio volume manager that fades your music out when you start a YouTube video."
featured: 'images/featured-earcandy-in-ubuntu-jaunty.png'
featuredStyle: 'chibi-cartoon'
featuredPalette: 'bright'
featuredPrompt: 'An ear-shaped candy turns a big volume knob, dimming a vinyl record’s speaker while a film clapperboard’s sound waves grow from another speaker'
---
[EarCandy](https://launchpad.net/earcandy) is a volume manager for PulseAudio that fades applications in and out based on your current activity. Meaning it can do handy things like muting your music playing when you decide to turn on a youtube video. [EarCandy](https://launchpad.net/earcandy) can sniff out applications to tell what kind of application they are

## Screenshots:
![earcandy.png](images/earcandy.png)

![earcandy2.png](images/earcandy2.png)

## How to install Earcandy on Ubuntu Jaunty

You can do this by using the following command:
```bash
sudo kate /etc/apt/sources.list
```
Then add the following to the end of the file:
```text
deb http://ppa.launchpad.net/earcandy-devel/ppa/ubuntu jaunty main
deb-src http://ppa.launchpad.net/earcandy-devel/ppa/ubuntu jaunty main
``
Then you can install earcandy by using the following command!
```bash
sudo apt-get install earcandy
```
