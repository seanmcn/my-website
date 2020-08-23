---
title: "GPG signed commits in PHPStorm on CentOS 7"
date: '2019-01-23T15:39:03.284Z'
slug: '2019/01/gpg-signed-commits-in-phpstorm-on-centos-7'
category: 'how-to'
tags: ['gpg', 'commit', 'phpstorm', 'git', 'how-to']
keywords: ['centos', 'commits', 'signed']
---

Having the functionality of automatically being prompted to sign your commits while still using PHPStorms Git GUI means you’ll never forget to sign commits again.

To start with, **the version of Git installed needs to be > 2.0**, otherwise certain options we are using will not work.

On CentOS 7 you’ll need to either build from source, or use a 3rd-party repository such as the [IUS Community Project](https://ius.io/) in order to do that. I prefer using repositories over building from source, as it’s easier to update the packages later on.

To use the 3rd-party repository method run the following:

```bash
yum install epel-release
yum remove git
rpm -U https://centos7.iuscommunity.org/ius-release.rpm
yum install git2u
```

Next, if you don’t have a GPG key yet, you’re going to need to generate one, [GitHub have a nice guide](https://help.github.com/articles/generating-a-new-gpg-key/#platform-all) on this already.

Next we need to add some options to our git config, I’ve went with adding to my global configuration here, however you can set this on a project by project basis by just omitting the `--global` tag.

```bash
git config --global commit.gpgsign true
git config --global user.signingkey ENTER_YOUR_KEY
```

If you’re confused on how to get your signing key for above, again [Github have a guide on that](https://help.github.com/articles/telling-git-about-your-signing-key/).

At this point, running `git commit -S -m "Example commit"` will prompt you to enter the password for your secret key.

The last part is to add the following configuration to `~/.gnupg/gpg.conf`
```bash
no-tty
```

Now when you make a commit in PHPStorm, you’ll be prompted for the password for your secret key, and the commit will be signed.