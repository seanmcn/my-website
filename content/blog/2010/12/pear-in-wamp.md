---
title: "Installing PEAR in WAMP"
date: '2010-12-27T20:39:03.284Z'
slug: '2010/12/installing-pear-in-wamp'
category: 'windows'
tags: ['pear', 'wampp', 'windows']
keywords: ['guide', 'install']
---

![pear.png](images/pear.png)

So this evening I went about attempting to install PEAR on my WAMP installation, this should be as simple as opening up a command window navigating to `C:/wamp/bin/php/*phpversion*` and running `go-pear.bat`, however upon doing this I ran into the following errors:

```bash
phar “C:\wamp\bin\php\php5.3.0\PEAR\go-pear.phar” does not have a signature
PHP Warning: require_once(phar://go-pear.phar/index.php): failed to open stream: phar error: 
invalid url or non-existent phar “phar://go-pear.phar/index.php” in C:\wamp\bin\php\php5.3.0\PEAR\go-pear.phar on line 1236

Warning: require_once(phar://go-pear.phar/index.php): failed to open stream: phar error: 
invalid url or non-existent phar “phar://go-pear.phar/index.php” in C:\wamp\bin\php\php5.3.0\PEAR\go-pear.phar on line 1236
Press any key to continue . . .
```

A couple of Google searches later I got the answer needed to fix my problem, simply running this command instead:
```bash
php -d phar.require_hash=0 PEAR/go-pear.phar
```
A couple of questions later PEAR was successfully installed and running, so if your running into the above error you now know what to do!