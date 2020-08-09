---
title: "Learn PHP: Output & Operators"
date: '2009-08-21T22:12:03.284Z'
slug: 'learn/php/1-output-and-operators'
tags: ['how-to', 'php', 'programming', 'learn-php']
category: 'learn-php'
---
> This series was severely outdated, as it was originally written in 2009, I have updated it with more modern options as of 12th July 2020

Now [you have PHP setup](/blog/learn/php/0/setup), we can start with a few of the basic principles / building blocks of the language.

##  Output
The first thing you want to be able to do is output data to your console, we can do this by using [the echo statement](https://www.php.net/manual/en/function.echo.php).
```php 
<?php
echo "hello world";
```

## Comments
Comments are multipurpose they allow you to temporarily cause code not to run as well as make notes describing code functionality.

PHP supports two [different ways of commenting](https://www.php.net/manual/en/language.basic-syntax.comments.php), C/C++ style and Unix shell style (Perl Style). We will focus on C/C++ style here.

Example's of echo via C++ Style are as follows:

```php
<?php
// Comments starting with this are single line.
echo "hello";
/* Any comments within this combination of symbols
            can span multiple lines  
*/
echo "world"; 
```
You can also use comments to temporarily cause a block of code to no longer run. In the example below the console won't output anything.
```php
<?php
/**
    echo "hello world";
*/
```

## Variables

You will use [variables](https://www.php.net/manual/en/language.variables.basics.php) for a variety of things when programming. Essentially they let you store some data to either use or modify later on.

Here are two examples of variables, one containing a string, the other an integer.
```php
<?php
$first_variable = "Variable One";
$second_variable= 1;
```

## Operators
There are a [number of operators](https://www.php.net/manual/en/language.operators.php) you can use within PHP.

### Arithmetic Operators
There are [plenty of arithmetic operators]( https://www.php.net/manual/en/language.operators.arithmetic.php) for operating on numbers.

Here are an example of a few of the basic ones you'll use frequently.
```php
<?php
$add = 2 + 1;
echo $add; // Will output '3'

$subtract = $add - 1;
echo $subtract; // Will output '2'

$multiply = $add * 4;
echo $multiply; // Will output '8'

$divide = $multiply / 2;
echo $divide; // Will output '4'
```

### String Operators
There are [two string operators](https://www.php.net/manual/en/language.operators.string.php) available in PHP. You'll use these for joining strings together like below:
```php
<?php
$variable = "Hello";
echo $variable . " world"; // Will output 'Hello world'

$variable .= " world";
echo $variable; // Will now output 'Hello world'
```
