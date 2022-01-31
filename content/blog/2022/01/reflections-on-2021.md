---
title: "Reflections on 2021"
date: "2022-01-31T11:39:19.327Z"  
slug: "2022/01/reflections-on-2021"  
category: "personal"  
tags: ["crypto","programming", "personal"]  
keywords: ["klima", "polygon", "fantom", "flutter", "ios", "android"]
---

With the first month of 2022 ending, I thought it would make sense to reflect on what I've picked up in 2021 and my goals for 2022. With the last of the COVID-19 restrictions are being removed in England, I am cautiously optimistic about what the future has in store.

# Flutter / App Development
In June, I decided to start learning how to create Android/iOS applications, fueled by a personal want to utilise the Health metrics from my iPhone. That was an unexpected venture for me, especially after finding out how easily [PWA's](https://web.dev/progressive-web-apps/) work.

I sized up two frameworks, [React Native](https://reactnative.dev/) & [Flutter](https://flutter.dev/). I decided to go with Flutter, mainly because I didn't know the underlying programming language [Dart](https://dart.dev/), and I'm always keen to learn something new.

Coming from a PHP/Python/JS background Dart was initially confusing. I found myself comparing it most to ReactJS. Null-safety isn't something I've worked with previously, but it wasn't too difficult to figure out.

Flutter itself is a lot of fun. There is something very satisfying about changing a line of code and seeing it update an emulated device's application. I'll likely do a blog post just on my development setup for Flutter, but in case I don't:
- Vojtech Pavlovsky has a great article on setting up the architecture for Bottom Navigation in Flutter [here](https://www.vojtech.net/posts/flutter-bottom-navigation/), he also has an updated version [here](https://www.vojtech.net/posts/auto-route-bottom-navigation/) which utilises `auto_route` & `flutter_bloc`. I found this a great starting point for creating apps with bottom navigation & a simple state.
- [Flutter Platform Widgets](https://pub.dev/packages/flutter_platform_widgets) is something else I've been utilising. This handy library allows you to create an application that will use either Cupertino (iOS) or Material (Android) styling depending on what type of device loads it.

# Crypto
> Nothing in this post should be considered financial advice. For full disclosure, I currently hold BTC, ETH, MATIC, FTM & KLIMA.
 
This year has certainly been interesting for cryptocurrencies. I've held off on mentioning cryptocurrencies at all on here, as there does seem to be a rather heated debate between "has technical value" and "another pyramid scheme" within the tech community. It is easy to look at NFT's and think "this is a joke", but I think the blockchain has much more potential than selling people links to images for absurd amounts of money.

I'm not going to discuss ETH or BTC, as I'm just holding those as something that may provide a return on investment over the next few years. I am interested to see how ETH switching to proof-of-stake affects its gas costs. However, I'm not particularly optimistic that it's going reduce gas costs enough that ETH becomes reasonable to frequently trade/transfer over.

MATIC & FTM are much more interesting to me, and their networks seem to be where most of the more interesting Defi projects live. There also seems to be more developers working on creating apps on these networks.

**Polygon**

The Polygon Network (MATIC) aims to scale existing cryptocurrencies by providing faster staking, without sacrificing decentralization. Polygon is trying to interconnect the ["layer 2"](https://ethereum.org/en/developers/docs/scaling/layer-2-rollups/)  ecosystem on Ethereum. You can see some of the apps on Polygon [here](https://awesomepolygon.com/).

**Fantom**

The Fantom Foundation (FTM) is built on DAG technology, allowing faster transactions and lower fees. Fantom is a general-purpose ["Layer 1"](https://www.binance.com/en/blog/fiat/layer-1-blockchain-tokens-everything-you-need-to-know-421499824684903155) solution. Fantom doesn't have a nice list of apps on it like Polygon does, but two I use are: [Spirit Swap](https://www.spiritswap.finance/) & [Spooky Swap](https://spookyswap.finance/)

## Klima
Of those two networks projects, [Klima](https://www.klimadao.finance/) (on Polygon) is one project that caught my eye this year, as it aims to drive carbon action, become a carbon-based reserve currency & facilitate the climate markets.

Their [documentation](https://docs.klimadao.finance/) lays out how they aim to achieve this much better than I can explain here, and [this medium article](https://medium.com/coinmonks/tokenomics-101-klima-dao-e8fac497454f) has a great breakdown of it.

I want to get more involved in contributing to Klima DAO over 2022, as I believe climate change is the ultimate issue we face, and Klima (to me) looks to be one of the most promising projects to make positive change in that regard.

## Solidity
With my goal to get more involved in contributing to Klima 2022, I've been learning Solidity. I found [Crypto Zombies](https://cryptozombies.io/en/course/) the best place to start, it's a great resource to easily learn all about smart contracts and how development on the blockchain actually works. [Ethernaut](https://ethernaut.openzeppelin.com/) seems to be the next logical place to go, learning how to find issues with smart contracts.