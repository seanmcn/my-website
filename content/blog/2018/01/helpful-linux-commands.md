---
title: "Helpful Linux commands"
date: '2018-01-14T15:39:03.284Z'
slug: '2018/01/helpful-linux-commands'
tags: ['linux', 'commands', 'screen']
category: 'linux'
---
So this is just going to be a bit of knowledge dump of things I’ve picked up lately / don’t want to forget.
### Bang Cash !$
If you are intending on running a few commands with the last argument of the command being the same this can be really helpful. For example:
```bash
ping 127.0.0.1
netmap !$
traceroute !$
```
Alternatively you can also do `!*` to use all the arguments of the previous command.

### sudo !!
This one is pretty simple `sudo !!` takes the last command and re-runs with sudo.

### Screen
`screen` is a great feature that allows you to do any of the following;
– Use multiple shells in a single SSH session.
– Run a long running process without maintaining an active shell or worrying about network disruptions.
– Disconnect and re-connect to a shell from multiple locations.

Using it is very simple, to start it you just use the command `screen`, from this point you are now inside of a window within screen.

Using screen requires remembering a few more commands (or noting them down in a blog post or something).

**Start screen:**

`screen`

To start a screen with a name, you can do the following `screen -S 'name'`

**Create another window:**

`Ctrl-a c`

**Next window:**

`Ctrl-a n`

**Previous window:**

`Ctrl-a p`

**Detach window:**

`Ctrl-a d`

This will detach your window and return you to your bash shell.

**Re-attach screen:**

`screen -r`
If you have multiple screens, this will display a list of them and you will have to use the name of the screen as a third parameter to reattach to it.

### Searching through previous commands
So as you may know you can use Control + R on Linux to search through previous commands you’ve entered in the terminal. You can with a few modifications of your `~/.profile` or `~/.bash_profile` improve what is stored in the `~/.bash_history file`, making this feature even more useful for remembering previous commands.

**Ignore certain commands:**

`HISTIGNORE="pwd:df:du:cd:ls"`

**Increase how many commands are stored:**

`HISTFILESIZE=10000 (the default on most systems is 500)`

**Don’t save duplicate commands:**

`HISTCONTROL=ignoredups`