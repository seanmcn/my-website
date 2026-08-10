---
title: "My Opinionated MacBook Setup"
date: "2026-08-10T19:00:00.000Z"
slug: "2026/08/opinionated-macbook-guide"
category: 'productivity'
tags: ['how-to', 'macos', 'developer-tools']
keywords: ['macbook', 'macos', 'mac setup', 'spotlight', 'homebrew', 'ghostty', 'iterm2', 'keyboard shortcuts', 'switching from windows']
featured: 'images/featured-opinionated-macbook-guide.png'
---

I moved to a Mac for development after years on Windows, and I've not gone back. I still have a Windows PC, but that's for gaming. There are Mac games. They aren't the reason you'd buy one.

I'm on both most weeks, so a few of these choices are really about keeping the same muscle memory across them. I've marked those. The rest is simply how I think a MacBook should be set up, and the guide I wish I'd had when I switched.

I've split it into three parts:

- **[Part 1](#part-1-for-everybody)** is what I'd change on anyone's machine, whatever they use it for. Settings that are wrong out of the box, and a few basics nobody tells you, like how to take a screenshot.
- **[Part 2](#part-2-the-next-level-up)** is for people who are on the machine most of the day and want it quicker to drive. Multitasking, moving around text, a couple of apps.
- **[Part 3](#part-3-if-you-write-code)** is for developers.

## Part 1: For everybody

Half an hour of settings, done once, and the machine stops fighting you.

### Strip Spotlight back to apps only

Do this one first. It's the single biggest change on the list.

Go to System Settings > Spotlight (or just type "Spotlight" into the Settings search box) and untick everything in the search results list **except Applications**.

Now press **Cmd + Space**, type the first three or four letters of an app, press Enter. That's how you open things on a Mac. It's the first shortcut worth learning.

Turning everything else off looks like the wrong move. Surely you want more results, not fewer? In practice it's the opposite. Leave it all on, type three letters, and you get:

- a dictionary definition
- a website nobody asked for
- an App Store suggestion
- somebody's phone number

The app you actually wanted is fourth in the list, so you can't hit Enter without stopping to look. Turn it all off and it becomes instant and completely predictable. Type, Enter, app opens, you never look at the screen.

You can switch a category back on if you find you miss it. I never have.

> I know Raycast and Alfred are popular, but I don't use either. Once Spotlight is stripped back to applications, it already does exactly what I want.

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

While you're there, open **Finder > Settings > Sidebar** and turn off anything you never click, including the iCloud entries if you don't use them. Mine is basically Documents, Downloads, Pictures and Applications.

A four-item sidebar you can hit without reading beats a fifteen-item one you scan every single time.

### Working with files in Finder

A few things behave differently enough to catch you out on day one:

- **Enter renames a file.** It doesn't open it. This one gets everybody.
- **Cmd + down** opens the thing you've selected.
- **Cmd + Delete** sends it to the Bin. There's no Delete key that does it.
- **Cmd + Shift + .** shows and hides hidden files.

> That last one is, without competition, my least favourite shortcut on the entire system. I have looked it up more times than I've looked up anything else on this list, it is nowhere in any menu, and I resent it every single time.

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

> **Windows habit, not the Mac way.** I do this because I'm on a Windows machine regularly and I'd rather not relearn the same shortcuts twice. If you're only ever on a Mac, don't bother, just learn Cmd and it'll be second nature in a week.

## Part 2: The next level up

This is what I'd do next if you're on the machine most of the day. Most of the useful bits are hidden until somebody tells you they exist.

### Spaces: making one screen feel like three

Any app can go full screen with the green button top left, or **Ctrl + Cmd + F**. When it does it gets its own **space**, which behaves like its own monitor. You slide between spaces by swiping left and right on the trackpad with three or four fingers depending on how yours is set (System Settings > Trackpad > More Gestures), or **Ctrl + left/right arrow** from the keyboard.

On the laptop with nothing plugged in, I'll typically have:

- a terminal full screen off to the left
- my main desktop in the middle, with Notion in an ordinary window
- Slack and email full screen off to the right

I move between them with a flick of the trackpad. No Alt-Tabbing, no hunting the Dock, no resizing anything to fit next to anything else.

On the laptop I mostly use full-screen apps and rarely create extra desktops by hand. Plugged into monitors, I do the opposite because one app swallowing a whole display is usually a waste. This is where the MacBook is particularly good. My 14-inch screen effectively becomes three screens, and the setup still works when I unplug the monitors.

### Apps, windows and Mission Control

**Cmd + Tab** cycles through open apps, much like Alt + Tab on Windows. The important difference is that it switches between *apps*, not windows. If you've got three Word documents open, that's one entry in the list, not three. For windows within the same app, use **Cmd + \`** (the backtick above Tab), so those three documents are one Cmd + Tab entry and three presses of Cmd + \`.

| Shortcut | What it does |
|---|---|
| **Cmd + Tab** | Cycle through open apps |
| **Cmd + \`** | Cycle windows within the current app |
| **Cmd + W** | Close the window |
| **Cmd + Q** | Quit the app |
| **Cmd + Shift + T** | Reopen a closed tab or window in Chrome or Firefox |
| **Ctrl + up arrow** | Mission Control, as does the F3 key on most MacBooks or a three or four-finger swipe up |

An app with no windows open is still running, which is why its Dock icon keeps a dot under it and why it's still sat there in Cmd + Tab. And shutting a browser window by accident is almost never the disaster it feels like, because Cmd + Shift + T keeps stepping back if you press it again.

Mission Control shows every window across all your displays, laid out so you can see what each one actually is.

This is what I use instead of Alt-Tab, and it's the thing I miss most when I'm back on Windows. You're looking at the actual windows rather than a row of near-identical app icons, so three windows of the same application are three separate things you can pick between, instead of one entry you cycle through and hope.

The catch is that it only stays useful if you're a bit disciplined about what's open. Thirty windows and every one of them is a tiny unreadable rectangle. So I minimise anything I'm not actively working in and pull it back off the Dock when I want it again. That keeps the Mission Control view down to a handful of windows I can identify at a glance, which is the whole point of it.

> You can also trigger Mission Control with a hot corner. I don't. Once you move between the laptop and external monitors, the corners stop being where your hands expect them. Ctrl + up works from anywhere.

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

### Apps worth installing

**[Thaw](https://github.com/thaw-app/Thaw)** cleans up your menu bar. Once you've got a few apps running, the row of icons along the top becomes an unreadable mess, and Thaw hides the ones you don't need and brings them back on a hover or a keypress. Free and open source, which a lot of Mac utilities aren't. This is the one to get.

**[The Unarchiver](https://theunarchiver.com/)** handles the archive formats macOS won't. The built-in tool really only does zip properly, so the first time someone sends you a .rar or a .7z and nothing happens when you double-click it, this is the answer. Free, install it once, forget it exists.

**[Rectangle](https://rectangleapp.com/)** snaps windows to halves, thirds and quarters with keyboard shortcuts. Recent macOS versions have some tiling built in, but Rectangle is faster and behaves more sensibly across multiple monitors. I use full screen for the apps I swipe between and Rectangle when I want an editor and terminal side by side.

## Part 3: If you write code

This is the part where the Mac stops being a nice laptop and starts being the reason people put up with the price.

### It's Unix underneath

macOS is a certified Unix, which means the gap between your laptop and the Linux box you deploy to is small. Tools built for servers install and run locally, without a compatibility layer, a VM or a translation shim.

You're not picking between cmd, PowerShell, WSL, Git Bash and MSYS2, each with its own idea of what a path is and none of them quite agreeing with your editor. There's a shell, things you install turn up in it, and it works.

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
brew install --cask ghostty
brew install --cask rectangle
brew install --cask the-unarchiver
```

And the bit I keep meaning to actually use:

```bash
brew bundle dump    # writes a Brewfile listing everything you have
brew bundle install # installs all of it on a new machine
```

> Full disclosure, I don't commit a Brewfile, and I only worked out fairly recently that I should. A new laptop, or one you've broken badly enough to wipe, becomes one command and a cup of tea instead of a lost afternoon. Do as I say and not as I do on that one.

### The terminal itself

Terminal.app is fine. If you drop in a few times a day to run something and get out again, don't bother changing it.

If you're in there most of the day, this is the one part of the Mac where I'd switch without thinking about it. I used **[iTerm2](https://iterm2.com/)** for years and it's still a perfectly good answer. These days I use **[Ghostty](https://ghostty.org/)** and I prefer it. It's quick, the defaults are sensible, and I get proper split panes without configuring anything.

The feature I'd not want to give up now is desktop notifications. A long build finishes, or Claude Code gets to the end of a job and wants an answer, and I'm told about it while I'm reading something else, instead of tabbing back every couple of minutes to check whether it's still going.

I mainly want the prompt to show my current Git branch and whether the working tree is dirty. Then I know the state of a repo as soon as I `cd` into it.

### Aliases

If I type something several times a day, it gets an alias:

```bash
alias gs='git status'
alias gp='git pull'
alias ll='eza -la --git'
```

Put them in `~/.zshrc` and they're there in every shell you open. I've got a few dozen now and I'd be slower without them. Keep `.zshrc` in your dotfiles and the aliases will follow you to the next machine.

## Closing thoughts

Give it a couple of weeks. The shortcuts stop being a fight, you stop reaching for the Dock, and eventually you'll try to swipe on a Windows laptop and get annoyed when nothing happens.

Almost none of this is on by default, which is the only reason I bothered writing it down. If there's something you've set up that I've missed, let me know.

I still wouldn't buy the desktop.