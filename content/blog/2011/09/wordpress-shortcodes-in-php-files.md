---
title: "WordPress – Shortcode in PHP files"
date: '2011-09-11T20:39:03.284Z'
slug: '2011/09/wordpress-shortcode-in-php-files'
category: 'programming'
tags: ['wordpress', 'php', 'programming']
keywords: ['plugin', 'shortcode']
featured: images/cartoon-computer-code.png
---
So in WordPress with plugins etc. you end up using shortcode in posts to keep things simple, an example would be if you want to display a gallery you would just use:
```
[galleries id="1"]
```
However trying to this when your outside of the "WordPress Loop" (in your theme files usually) you will hit the problem that WordPress won’t parse the shortcode.

The solution is very simple, just append the following to your shortcode:
```php
echo apply_filters('the_content', '[galleries id="1"]');
```

And it works!

To read up more on shortcodes in WordPress click [here](https://developer.wordpress.org/reference/functions/do_shortcode/) .