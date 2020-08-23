---
title: "Learn PHP: Setup"
date: '2009-07-07T22:12:03.284Z'
slug: 'learn/php/0-setup'
tags: ['php', 'programming', 'learn-php']
category: 'php-learn'
---
> This series was severely outdated, as it was originally written in 2009, I have updated it with more modern options as of 12th July 2020

## Cloud based options
There are plenty of free cloud based editors that will allow you to get up and running without having to install anything on your computer. If you are just looking to try out PHP and aren't sure you will continue using it, this is the best option.

- [Repl.it PHP](https://repl.it/languages/php) - No account needed & no setup required.
- [PHP Tester](http://phptester.net/) - No account needed & and no setup required.
- [Code Anywhere](https://codeanywhere.com/) - Account needed & some minor setup required.

## Windows options

#### Wamp
[Wamp](https://www.wampserver.com/) is a GUI installer that will guide you through installing a web server [Apache](https://httpd.apache.org/) a database [mySQL](https://www.mysql.com/), the [PHP](https://php.net/) programming language and [PhpMyAdmin](https://www.phpmyadmin.net/) which allows you to easily manage your databases. 

If you are looking for an option for more long term use, this is the option I would suggest.


#### Xampp
[Xampp](https://www.apachefriends.org/index.html) is another GUI installer, made by Apache. It will install a web server [Apache](https://httpd.apache.org/), a database [MariaDB](https://mariadb.org/) and two programming languages [PHP](https://php.net/) and [Perl](https://www.perl.org/).

#### PHP Built-in web server
As of PHP 5.4 there is now a [built-in web server](https://www.php.net/manual/en/features.commandline.webserver.php) available in PHP. 

This means that you can now just go [here](https://windows.php.net/download/) and download the latest "Non Thread Safe" archive. You should then extract the archive to somewhere (eg `C:\php`) and then add that directory to your path as explained [here](https://www.php.net/manual/en/faq.installation.php#faq.installation.addtopath). 

[This Stack Overflow answer](https://stackoverflow.com/questions/1623914/what-is-thread-safe-or-non-thread-safe-in-php) contains answers that explain in detail the differences between "Thread Safe" vs "Non Thread Safe". 

## OSX options

For Mac OSX the only easy option I'm aware of is installing via [Homebrew](https://brew.sh/), if you don't already have Homebrew, it is a package manager that if you are getting into development you will want to have installed.

Once Homebrew is installed you can just run the following to install php.

```bash
brew install php
```

## Linux options
If you are using Linux, you are going to need to utilise a search engine in order to get setup. Digital Ocean have good walkthroughs like [this one](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04) for Ubuntu 18.04.


You can now move onto the next part [Learn PHP: Output & Operators](/blog/learn/php/1-output-and-operators)