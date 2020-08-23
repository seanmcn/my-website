---
title: "Learn PHP: Ifs & Else's"
date: '2009-08-28T05:12:03.284Z'
slug: 'learn/php/2-ifs-and-elses'
tags: ['php', 'programming', 'learn-php']
category: 'php-learn'
---

Continuing on from [Learn PHP: Output And Operators](/blog/learn/php/1-output-and-operators), we can start learning about control statements which will make up the logic of your code.

Here is one in action:
```php
<?php
$condition = true;
if ($condition) {
    echo 'condition is true';
}
```
Simple enough to understand? First we are setting a variable `$condition` to = `true`. Then we test if that variable equals true, if so it will output anything within the curly brackets, in this instance it will output the statement `condition is true`.

Now if statements don't seem on their own! What you really want is if / else statements. Setting up a similar example to the above, but with a number stored in the variable:
```php
<?php
$condition = 10;
if ($condition == 5) {
    echo "condition is 5";
}
```
Here the variable is set to 10. PHP Checks if it is 5. As we all know 10 is not 5, so PHP does nothing.

However in this statement, we add some more checks using the `else if` and `else` control words:
``` php
<?php
$condition = 10;
if ($condition == 5) {
    echo "condition is 5";
} else if ($condition < 5) {
    echo "condition is less than 5";
} else {
    echo "condition is $condition";
}
```
In the above if the condition is 5, PHP will output that it is 5. It then checks to see if the condition is less than 5, and outputs if that is the case. Lastly, if it doesn't match anything else it outputs what the condition is. So in this instance we would get the output `condition is 10`

One last example using strings just to highlight that they can also make use of this functionality:
```php
<?php
$condition = "yes";
if ($condition == "no"){
    echo "condition is false";
} else if ($condition == "yes"){
    echo "condition is true";
} else {
    echo "Something happened to the variable";
}
```
Here you can see that the condition is actually a word. PHP checks it just like it would a number and outputs all the same. Here PHP would output `condition is true`.

You can now move onto the next part [Learn PHP: Includes & Requires](/blog/learn/php/3-includes-and-requires)