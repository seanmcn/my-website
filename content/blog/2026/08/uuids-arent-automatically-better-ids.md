---
title: "UUIDs Aren't Automatically Better IDs"
type: 'note'
draft: true
date: "2026-08-07T09:00:00.000Z"
slug: "2026/08/uuids-arent-automatically-better-ids"
category: 'systems'
tags: ['sql', 'cheat-sheet']
keywords: ['uuid', 'uuidv7', 'primary key', 'postgres', 'b-tree']
summary: 'Random v4 scatters your inserts across the index. I wanted the uniqueness guarantee and had been buying it without checking the price.'
margins:
  - label: 'In one line'
    text: '"Globally unique, no coordination needed" was the property I wanted, not the format.'
  - label: 'Ended up using'
    text: 'UUIDv7: a timestamp in the high bits, so new rows stay roughly adjacent.'
---

I reached for UUIDs on a new table without thinking about it, the way you do when something has been the default answer for long enough. The table was going to be wide, heavily indexed, and written to constantly.

Random v4 UUIDs scatter inserts across the whole B-tree, so every write touches a different page and the index stops fitting comfortably in memory. Sequential integers keep new rows adjacent, which is why they stay fast on exactly the workload I had. UUIDv7 splits the difference by putting a timestamp in the high bits, and that is what I ended up using.

The lesson isn't that UUIDs are bad. It's that "globally unique, no coordination needed" is the property I actually wanted, and I'd been buying it without ever checking the price.
