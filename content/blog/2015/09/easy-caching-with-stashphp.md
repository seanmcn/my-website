---
title: "Easy Caching with StashPHP"
date: '2015-09-08T00:39:03.284Z'
slug: '2015/09/stash-php'
tags: ['programming', 'php', 'caching']
category: 'php'
---

Frequently with PHP you are going to need to cache things, mostly expensive SQL queries, but also data you aren't going to want to be inserting into the database on every page hit, for instance website statistics.

With PHP we have a few options to achieve this;

- **Caching with the [file system](http://php.net/manual/en/book.filesystem.php) .**
  - Pros:
    - Works well with the Opcode cache
    - Usually the fastest method of caching for small or medium websites
  - Cons:
    -  Clearing the cache can be a lot slower as you will have to recursively search through path’s and delete.
- **Caching with [SqlLite](https://www.sqlite.org/)**
  - Pros:
    -  Can be substantially faster than a full-blown RDBMS
    - All data is stored in a normal file in the host’s file system.
  - Cons:
    -  Can only support one writer at a time, which can cause high file system latency, which is inconvenient if there are many clients trying to access it simultaneously.
-  **Caching with [APC](http://php.net/manual/en/book.apc.php)**
   -   Pros:
       - Makes PHP faster for you through the so called opcode caching.
       - No special configuration required.
   -   Cons:
       -   Practically none
- **Caching with [Memcached](http://memcached.org/)**
  - Pros:
    -  Allows machines to pool their memory together as one large memory cache, perfect for large websites.
    -    Cross platform and cross RDBMS
  - Cons:
    - Stores data in the RAM, not ideal for small systems
    - Is considered to be a volatile in-memory key/value store
- **Caching with [Redis](http://redis.io/)**
  - Pros:
    - Can act like memcached as a key/value store however it’s really a data structure server.
    - Persistence to disk, by default.
    - Values up to 512MB in size
    - Built in clustering
    - Extremely fast at everything
  - Cons:
    -  The more objects you put in it, the more memory its going to use.

So as you can see there are a bunch of different systems that handle caching in arguably better or worse ways depending on how big your website is. Putting a small website on Redis is probably overkill,  you might already have set up a RDBMS solution and now not want to change to a key value store etc.

This is where StashPHP comes in, you basically use the StashPHP library to cache things like so:

First you setup the driver to use, lets just use File System for the moment:

```php
<?php 
// Create Driver with default options
$driver = new Stash\Driver\FileSystem(); 
$driver->setOptions(array());

// Inject the driver into a new Pool object.
$pool = new Stash\Pool($driver);
```

Now you can setup your by wrapping the following code around your code:

```php
<?php 
// Get a cache item.
$item = $pool->getItem('path/to/item');

// Attempt to get the data
$data = $item->get();

// Check to see if the data was a miss.
if($item->isMiss())
{
    // Let other processes know that this one is rebuilding the data.
    $item->lock();

    // Run intensive code
    $data = codeThatTakesALongTime();

    // Store the expensive to generate data.
    $item->set($data);
}

// Continue as normal.
useDataForStuff($data);

```

Later on when you decide to add another cache, rather than needing to go rewrite all your caching calls etc. you can just change the setup of the drivers like so:

```php
<?php 
$subDrivers = array(); 
$subDrivers[] = new Stash\Driver\Apc(); 
$subDrivers[] = new Stash\Driver\FileSystem(); 
$subDrivers[] = new Stash\Driver\Memcached(); 
$options = array('drivers' => $subDrivers);
$driver = new Stash\Driver\Composite($options);

$pool = new Stash\Pool($driver);
```
This saves you a bunch of time and allows testing what suits your application best.