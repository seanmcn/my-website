---
title: "CSS Code for Wrapping Long URLs and Text"
type: 'note'
date: '2011-10-04T20:39:03.284Z'
slug: '2011/10/css-code-for-wrapping-long-urls-and-text'
category: 'programming'
tags: ['css', 'how-to']
summary: "The CSS that stops a long URL or email address breaking a layout on small screens."
featured: 'images/featured-css-wrap-long-text.png'
featuredStyle: 'mascot-cartoon'
featuredPalette: 'balanced'
featuredPrompt: 'A cute browser window with a simple face and small arms accordion-folds an endless link ribbon to tuck it neatly into a tiny phone frame without overflowing.'
---

Ran into a problem last night where a long email was messing up a design in smaller screen resolutions.

Perfect fix down below:
```css
pre {
white-space: pre; /* CSS 2.0 */
white-space: pre-wrap; /* CSS 2.1 */
white-space: pre-line; /* CSS 3.0 */
white-space: -pre-wrap; /* Opera 4-6 */
white-space: -o-pre-wrap; /* Opera 7 */
white-space: -moz-pre-wrap; /* Mozilla */
white-space: -hp-pre-wrap; /* HP Printers */
word-wrap: break-word; /* IE 5+ */ }
```
Thanks to perishable press for this one, read more about it [here](http://perishablepress.com/press/2010/06/01/wrapping-content/) .
