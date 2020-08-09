---
title: "Learn PHP: Includes & Requires"
date: '2009-09-16T05:12:03.284Z'
slug: 'learn/php/3-includes-and-requires'
tags: ['php', 'programming', 'learn-php']
category: 'php-learn'
---

Continuing on from [Learn PHP: Ifs & Elses](/blog/learn/php/2-ifs-and-elses), we can start learning about including other files, which is very helpful for things like sidebars on your website etc.

Include and Require include a file within another PHP script. There are four ways of doing this:

```php
<?php
include();
include_once();
require();
require_once();
```
Now using them is simple. Lets say you have a file called "sidebar.php" with your links? All you have do do is the following:
```php
<?php
include('sidebar.php');
```
One thing to remember is how to traverse directories in PHP. For instance, if my file "sidebar.php" is in a folder called "includes" you could go:

```php
<?php
include('includes/sidebar.php');
```
Or another approach, if my file "sidebar.php" is in the parent directory, you could go:

```php
<?php
include('../sidebar.php');
```
Now why are there four different ways to include?

Include and Require are practically the same, apart from the way they give out errors. Include will continue parsing your script and just log an error. Require however will stop the whole script to give you an error. Really it’s all down to what you want.

`include_once` and `require_once` only allow you to include the file once. This is not only more secure but stops from errors where the file was just included and variables were overwritten halfway through the script. Again they give out the same errors as include and require.

So lets go over one of each!
```php
<?php
include('sidebar.php');
include_once('sidebar.php');
require('sidebar.php');
require_once('sidebar.php');
```