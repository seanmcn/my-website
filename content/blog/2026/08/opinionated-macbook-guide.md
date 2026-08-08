---
title: "An Opinionated View on Making Your MacBook Better"
date: "2026-08-08T09:00:00.000Z"
slug: "2026/08/opinionated-macbook-guide"
category: 'productivity'
tags: ['how-to', 'macos', 'developer-tools']
keywords: ['macbook', 'macos', 'mac setup', 'spotlight', 'homebrew', 'iterm2', 'keyboard shortcuts', 'switching from windows']
---

I moved to a Mac for development after years of doing it on Windows, and I've not gone back. I do still have a Windows PC, but that's for gaming, which a Mac is never realistically going to handle. There are Mac games. They aren't the reason you'd buy one.

So I'm on both most weeks, and a few of the things below are about keeping my muscle memory working across the two rather than doing everything the Mac way. I've flagged those where they come up, so you can skip them if you're only ever on a Mac.

The rest is opinion. It's the post I wish someone had handed me when I switched, because macOS ships with a lot of this turned off and nothing tells you it's there. It's also about MacBooks specifically, since I'd never buy a Mac desktop.

I've split it into three parts:

- **Part 1** is what I'd change on anyone's machine, whatever they use it for. Settings that are wrong out of the box, and a few basics nobody tells you, like how to take a screenshot.
- **Part 2** is for people who are on the machine most of the day and want it quicker to drive. Multitasking, moving around text, a couple of apps.
- **Part 3** is if you write code.

How much of it is useful to you depends on how much time you spend on the thing, and how much you're already doing.

## Part 1: For everybody

Half an hour of settings, done once, and the machine stops fighting you.

### Strip Spotlight back to apps only

Do this one first. It's the single biggest change on the list.

Go to System Settings > Spotlight (or just type "Spotlight" into the Settings search box) and untick everything in the search results list **except Applications**.

Now press **Cmd + Space**, type the first three or four letters of an app, press Enter. That's how you open things on a Mac. It's the one shortcut in this section and it's worth the twenty seconds it takes to learn.

Turning everything else off looks like the wrong move. Surely you want more results, not fewer? In practice it's the opposite. Leave it all on and typing three letters gets you a dictionary definition, a website nobody asked for, an App Store suggestion and somebody's phone number, and the app you actually wanted is fourth in the list, so you can't hit Enter without stopping to look. Turn it all off and it becomes instant and completely predictable. Type, Enter, app opens, you never look at the screen.

You can switch a category back on if you find you miss it. I never have.

### Hide the Dock

System Settings > Desktop & Dock > tick **Automatically hide and show the Dock**.

This feels wrong for about a day. Then you have all that screen back, and when you do want the Dock you flick the cursor to the bottom and it's there.

The reason it works is the previous section. On Windows the taskbar is how you find things, so hiding it is madness. On a Mac you find things with Cmd + Space, so the Dock only needs the handful of apps you're in constantly. Mine has about five things on it.

While you're in that panel, turn off **Show suggested and recent apps in Dock**, otherwise it slowly fills with things you opened once by accident.

### Turn the scrollbars back on

macOS hides scrollbars until you actually start scrolling, so you often can't tell whether there's more content below without flicking the trackpad to find out. I find it properly irritating and it's one of the first things I change on a new machine.

**System Settings > Appearance > Show scroll bars > Always.**

The default is "Automatically based on mouse or trackpad", which is also why they seem to behave inconsistently: plug a mouse in and they turn up, unplug it and they don't. Set it to Always and you can see how far down a page you are at a glance, and drag them about like a normal person.

### Fix Finder

Finder hides useful information by default, and makes a couple of odd guesses about what you probably wanted.

**Finder > Settings > General:** set **New Finder windows show** to your home folder, the one with your name on it. It defaults to Recents, which I've never got any use out of. Home is a predictable place to start from every time, where Recents is a pile of whatever you happened to touch last.

**Finder > Settings > Advanced:**

- Tick **Show all filename extensions**
- Under "Keep folders on top", tick **In windows when sorting by name**. That's the one that matters, it stops folders being scattered in amongst your files. The "On Desktop" option underneath only affects desktop icons, take it or leave it.
- Set **When performing a search** to **Search the Current Folder**. It defaults to searching the entire Mac, which is almost never what you meant. If you've navigated to a folder and then typed in the search box, that folder is what you're looking in.

**In the View menu:** turn on **Show Path Bar** and **Show Status Bar**. You get a breadcrumb trail along the bottom telling you where you actually are, and a count of what's in the folder.

### Trim the Finder sidebar

**Finder > Settings > Sidebar.** This list is entirely yours and it's worth five minutes.

Turn off every iCloud entry if you don't use iCloud. Turn off anything else you know you'll never click. Keep it short. Mine is basically Documents, Downloads, Pictures, Applications.

A four-item sidebar you can hit without reading beats a fifteen-item one you scan every single time.

### Working with files in Finder

A few things behave differently enough to catch you out on day one:

- **Enter renames a file.** It doesn't open it. This one gets everybody.
- **Cmd + down** opens the thing you've selected.
- **Cmd + Delete** sends it to the Bin. There's no Delete key that does it.
- **Cmd + Shift + .** shows and hides hidden files.

That last one is, without competition, my least favourite shortcut on the entire system. I have looked it up more times than I've looked up anything else on this list, it is nowhere in any menu, and I resent it every single time.

### Switching between apps

**Cmd + Tab** cycles through your open apps. Hold Cmd down and keep tapping Tab to go further along the row, exactly like Alt + Tab did.

The difference is that it switches between *apps*, not windows. If you've got three Word documents open, that's one entry in the list, not three. More on that in part 2.

The other one to learn at the same time is **Ctrl + up arrow**, or the F3 key on most MacBooks. That zooms out and shows you every window you've got open, laid out so you can see what each one actually is, and you click the one you want. I use it far more than Cmd + Tab.

### Taking a screenshot

There's no Print Screen key, and this is the thing people ask me most often.

- **Cmd + Shift + 4** gives you crosshairs to drag a box around whatever you want. The screenshot lands on your desktop.
- **Cmd + Shift + 5** opens a small toolbar with all the options: whole screen, one window, a region, and screen recording if you need to capture a video.

If you only learn one, learn Cmd + Shift + 4.

### The Cmd key, and how to have Ctrl back if you'd rather

On a Mac, **Cmd** does what Ctrl used to. Copy, paste, save, undo, all exactly the same, just one key further in. Ctrl still exists and does other things, so pressing it out of habit doesn't break anything, it just quietly does nothing.

Most people adapt within a week and never think about it again. But if you've got twenty years of Ctrl + C living in your left thumb and you resent being made to relearn it, you don't have to. You can just swap the two keys over:

1. **System Settings > Keyboard > Keyboard Shortcuts...**
2. **Modifier Keys**
3. Set **Control** to Command, and **Command** to Control
4. Done

Now Ctrl + C copies exactly like it always did, and the whole machine feels a good deal more like a PC.

One thing to know before you do it. macOS stores this **per keyboard**, so if you later plug in a USB keyboard you'll need to set it again for that one. Same panel, but use the dropdown at the top to pick which keyboard you're configuring first.

*Windows habit, not the Mac way. I do this because I'm on a Windows machine regularly and I'd rather not relearn the same shortcuts twice. If you're only ever on a Mac, don't bother, just learn Cmd and it'll be second nature in a week.*

## Part 2: The next level up

This is what I'd do next if you're on the machine most of the day. Less about settings, more about knowing a few things exist, because most of what makes a Mac quick to use is invisible until somebody points at it.

Two of these are apps. If your laptop is managed by work you may need them approved first, but both are well known and it's not usually a difficult ask.

### Spaces: making one screen feel like three

If you take one thing from this post, take this.

Any app can go full screen with the green button top left, or **Ctrl + Cmd + F**. When it does it gets its own **space**, which behaves like its own monitor. You slide between spaces by swiping left and right on the trackpad with three or four fingers depending on how yours is set (System Settings > Trackpad > More Gestures), or **Ctrl + left/right arrow** from the keyboard.

On the laptop with nothing plugged in, I'll typically have:

- a terminal full screen off to the left
- my main desktop in the middle, with Notion in an ordinary window
- Slack and email full screen off to the right

I move between them with a flick of the trackpad. No Alt-Tabbing, no hunting the Dock, no resizing anything to fit next to anything else.

Which half of it I use depends on the setup. On the laptop it's almost all full-screen mode and I rarely make desktops by hand. Plugged into monitors it flips, because full screen stops earning its keep once one app is swallowing a whole big display. Either way the laptop is where it shines: one 14 inch screen that feels like three, and multitasking that doesn't fall apart when you undock.

### Windows are not apps

**Cmd + W** closes a window. **Cmd + Q** quits the app. An app with no windows open is still running, which is why its Dock icon keeps a dot under it and why it's still sat there in Cmd + Tab.

That's also why Cmd + Tab only gets you so far. It moves between apps, so for windows within an app you want **Cmd + `** (the backtick, above Tab). Three documents in one app is one Cmd + Tab entry and three presses of Cmd + `.

Useful side effect: **Cmd + Shift + T** in Chrome or Firefox reopens what you just closed and keeps stepping back if you press it again. Shutting a browser window by accident is almost never the disaster it feels like.

### Mission Control, and keeping it worth using

I mentioned **Ctrl + up arrow** in part 1. It's worth a bit more, because it's the single thing I use most and it spans displays, so on a desk with two monitors you get every window from both in one view. Three or four fingers swiped up on the trackpad does the same.

This is what I use instead of Alt-Tab, and it's the thing I miss most when I'm back on Windows. You're looking at the actual windows rather than a row of near-identical app icons, so three windows of the same application are three separate things you can pick between, instead of one entry you cycle through and hope.

The catch is that it only stays useful if you're a bit disciplined about what's open. Thirty windows and every one of them is a tiny unreadable rectangle. So I minimise anything I'm not actively working in and pull it back off the Dock when I want it again. That keeps the Mission Control view down to a handful of windows I can identify at a glance, which is the whole point of it.

### Moving around text

This is the set I'd actually learn, because you use it constantly and Home and End don't do what you expect.

| Shortcut | What it does |
|---|---|
| **Cmd + left / right** | Start and end of the line |
| **Cmd + up / down** | Top and bottom of the document |
| **Option + left / right** | Jump a word at a time |
| **Option + Delete** | Delete the previous whole word |
| **Cmd + Delete** | Delete back to the start of the line |
| **Fn + Delete** | Forward delete, the key Mac keyboards don't have |

Hold **Shift** with any of those and you select instead of just moving. That's the bit that makes it click. Option + Shift + right selects the next word, Cmd + Shift + left selects back to the start of the line.

### Hot corners, which I don't use

**System Settings > Desktop & Dock > Hot Corners** assigns an action to each corner of the screen, so you can fire Mission Control by shoving the cursor into the top right rather than pressing anything.

Plenty of people love it and I want you to know it's there. I turned it off, because as soon as you're moving between the laptop on its own and the laptop plugged into a monitor, the corners stop being where your hands expect them. Ctrl + up does the same job from anywhere.

### Two apps worth installing

**[Thaw](https://github.com/thaw-app/Thaw)** cleans up your menu bar. Once you've got a few apps running, the row of icons along the top becomes an unreadable mess, and Thaw hides the ones you don't need and brings them back on a hover or a keypress. Free and open source, which a lot of Mac utilities aren't. This is the one to get.

**[The Unarchiver](https://theunarchiver.com/)** handles the archive formats macOS won't. The built-in tool really only does zip properly, so the first time someone sends you a .rar or a .7z and nothing happens when you double-click it, this is the answer. Free, install it once, forget it exists.

## Part 3: If you write code

This is the part where the Mac stops being a nice laptop and starts being the reason people put up with the price.

### It's Unix underneath

macOS is a certified Unix, which means the gap between your laptop and the Linux box you deploy to is small. Tools built for servers install and run locally, without a compatibility layer, a VM or a translation shim. You're not picking between cmd, PowerShell, WSL, Git Bash and MSYS2, each with its own idea of what a path is and none of them quite agreeing with your editor. There's a shell, things you install turn up in it, and it works.

That's a low bar. Windows still hasn't cleared it, and I don't miss the hours I used to lose to working out which terminal I was in and why the path had backslashes in it.

It is Unix rather than Linux, so every so often you'll hit a command that takes slightly different flags to the one on your server. It's a minor irritation and easily worked around, but worth knowing it's a thing so you don't lose an hour wondering why a script that works fine in CI doesn't work here.

### Homebrew

[Homebrew](https://brew.sh) is how you install software on a Mac. Not the App Store. One command instead of finding a website, downloading a .dmg, dragging an icon and then dealing with the update prompt six weeks later.

Two forms:

```bash
brew install htop          # command line tools
brew install --cask slack  # actual GUI applications
```

Casks are the part people miss. You can install real desktop apps this way, including everything in this post:

```bash
brew install thaw
brew install --cask rectangle
brew install --cask the-unarchiver
```

And the bit I keep meaning to actually use:

```bash
brew bundle dump    # writes a Brewfile listing everything you have
brew bundle install # installs all of it on a new machine
```

Full disclosure, I don't commit a Brewfile, and I only worked out fairly recently that I should. A new laptop, or one you've broken badly enough to wipe, becomes one command and a cup of tea instead of a lost afternoon. Do as I say and not as I do on that one.

### Terminal tools that just work

The nice thing is that the tools you already know from SSHing into servers are just available locally:

```bash
brew install htop tmux jq ripgrep fd bat eza
```

`htop` for what's eating your CPU. `tmux` for keeping sessions alive and splitting panes, though I'll admit I still reach for `screen` out of habit, which is already on the machine and does me fine. `jq` for making JSON readable. `ripgrep` and `fd` as much faster replacements for grep and find. `bat` as a `cat` that has syntax highlighting and knows what a page is. `eza` as an `ls` that colour-codes by file type and, with `--git`, shows you the git status of every file in the listing.

None of this needs setting up. It installs, it's on your PATH, it behaves the way the man page says it does.

### The terminal itself

Terminal.app is fine. If you drop in a few times a day to run something and get out again, don't bother changing it.

If you're in there most of the day, this is the one part of the Mac where I'd switch without thinking about it. **[iTerm2](https://iterm2.com/)** is what I use. **[Ghostty](https://ghostty.org/)** is the newer option if you're starting fresh. Either gives you proper split panes and much better search.

The real win is customisation, because a good setup tells you things rather than just waiting for input. A decent prompt shows the current git branch and whether the tree is dirty, so you know the state of a repo the moment you `cd` into it. [Starship](https://starship.rs/) or [Powerlevel10k](https://github.com/romkatv/powerlevel10k) get you most of the way out of the box, and [oh-my-zsh](https://ohmyz.sh/) bundles up plugins and themes if you'd rather pick from a list than configure it yourself.

### Aliases

Worth setting up early because they compound. Anything you type more than a few times a day becomes two letters:

```bash
alias gs='git status'
alias gp='git pull'
alias ll='eza -la --git'
```

Put them in `~/.zshrc` and they're there in every shell you open. I've got a few dozen now and I'd be slower without them. Spend an evening on it, then keep the config in your dotfiles and never do it again.

### Other apps worth knowing about

**[Rectangle](https://rectangleapp.com/)** is the one I'd install. It snaps windows to halves, thirds and quarters with keyboard shortcuts. Recent macOS has some tiling built in now, but Rectangle is faster and behaves far more sensibly across multiple monitors. It pairs well with the spaces setup from part 2: full screen for the things you swipe between, Rectangle for when you want an editor and a terminal side by side to the pixel. Free and open source, where most of the alternatives charge.

**Raycast** and **Alfred** are the ones I'd skip, and I know that's unpopular. They replace Cmd + Space with something much bigger: clipboard history, window management, scripts, an AI box. Spotlight stripped back the way part 1 describes is already excellent at the one job I want from it, and it's excellent at that partly because it isn't trying to do anything else. Keep the launcher light and let it launch things. Preference rather than fact, and plenty of people I respect disagree.

## Closing thoughts

Give it a couple of weeks. The shortcuts stop being a fight, you stop reaching for the Dock, and eventually you'll try to swipe on a Windows laptop and get annoyed when nothing happens.

Almost none of this is on by default, which is the only reason I bothered writing it down. If there's something you've set up that I've missed, let me know.

I still wouldn't buy the desktop.
