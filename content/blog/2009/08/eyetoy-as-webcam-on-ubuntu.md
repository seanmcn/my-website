---
title: "Eyetoy as a Webcam on Ubuntu"
date: '2009-08-21T11:12:03.284Z'
slug: '2009/08/eytoy-as-a-webcam-on-ubuntu'
tags: ['how-to', 'linux', 'ubuntu', 'eyetoy']
category: 'how-to'
---
![EyeToy.png](images/eyetoy.jpg)

People say using linux is complicated. That just isn't true anymore. Back when I first started using Ubuntu there was not much support for using the Eyetoy as a webcam. Now however using the eyetoy as a webcam is a walk in the park!

Just open up a terminal window and copy the following into it:

```bash
sudo apt-get update
sudo apt-get install ov51x-jpeg-source module-assistant
module-assistant a-i ov51x-jpeg
```

And as easy as that, your webcam is working!