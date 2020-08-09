---
title: "Making a simple RTS game – Week Two"
date: '2016-09-09T15:39:03.284Z'
slug: '2016/09/making-simple-rts-game-week-two'
tags: ['javascript', 'game-development', 'simple-rts-game']
category: 'game-development'
---
So week two has gone relatively well, I didn’t spend as much time working on the game as I would have liked, it’s hard going from programming at work to programming at home every day. However I persevered and at least made some progress.

I ended up making a map since it was hard to try develop controls and camera without having anything to see, I found out about [Tiled](http://www.mapeditor.org/) which is a free tile map editor, very easy to use. Not wanting to waste my time on trying to create graphics (and hating whatever I ended up making), I browsed [/r/gamedev](http://reddit.com/r/gamedev) for some free assets to do for the moment, turns out [this Kenny NL guy](http://kenney.nl/) has some amazing stuff for free up there. I ended up going with his '[Topdown shooter pack](http://kenney.nl/assets/topdown-shooter)' as it seemed visually appealing to me.

Next step was figuring out how to get the cursor (arrow) keys to work as input, once I figured out how to do that I set those keys up to handle the camera movement. That was easy enough.

After that I wanted to deal with the mouse moving the map when near the edges of the screen, that proved a little more difficult, but not too bad.

My main achievement for the week (and the hardest part) was having the mouse create selection boxes, as you would in Windows etc. This will be used later on for selecting units & buildings. This proved more problematic as I first started out using the built in Phaser `Rectangle Object` and setting the `(X,Y)` to the point where the mouse was clicked and having the `(width,height)` update to where the mouse is before the left click is released. The first issue was my map is larger than the actual screen so it would not work once you scroll. Not helpful, luckily I then realised I could just add the `camera.x` and `camera.y` positions to my initial `(x,y)` points, and it is all good!

Lastly I realised that I shouldn’t have used the `Rectangle object` at all as the only way to fill that is by using a debug function in render (not what I intended), so I ended up having to switch that over to using `game.graphics` instead.

Also as a note I started making the UI for a mineral count in the top right ([thanks Game Icons](http://game-icons.net/)), doing it in jQuery as I couldn’t figure out how to do graphics on the screen at the time, but after going through my selection box stuff I now realise I need to re-do that part.

I’ve come to realise some things are going to be more complicated than I anticipated, for instance implementing a mini-map I am kind of dreading. However overall working with Phaser has been great, there are lots of resources out there and the community in both Slack and IRC are very helpful.

Here’s a crappy video of where we are so far:

[![Video of game functionality](https://img.youtube.com/vi/q2V6toXFCH0/0.jpg)](https://youtu.be/q2V6toXFCH0)

I’m unsure if I will have enough changes to do a Week 3 next week as I’m currently in the process of finding a new place to live in London and it’s a whole insane experience itself, very time consuming, very tiring and very depressing financially. So week 3 might be on the 23rd, we’ll see!