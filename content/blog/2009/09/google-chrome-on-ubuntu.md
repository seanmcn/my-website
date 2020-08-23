---
title: "Google Chrome on Ubuntu"
date: '2009-09-22T07:39:03.284Z'
slug: '2009/09/google-chrome-on-ubuntu'
category: 'software'
tags: [ 'software', 'ubuntu', 'linux']
keywords: [ 'chromium', 'install']
---
If your using Ubuntu you can now start using Chrome, or Chromium at least, which is based on it. Daily builds of Chromium can be got from [here](https://launchpad.net/~chromium-daily/+archive/ubuntu/ppa).

You'll need to add the following repositories to get Chromium:

Note: Substitute interpid with jaunty or hardy as needed!
```text
deb http://ppa.launchpad.net/chromium-daily/ppa/ubuntu intrepid main
deb-src http://ppa.launchpad.net/chromium-daily/ppa/ubuntu intrepid main
```
Then you can then install it by opening a terminal and do the following command:
```bash
sudo apt-get install chromium-browser
```
Of course this is still in Pre-Alpha so make sure to keep another browser installed! ;)