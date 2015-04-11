# agmljs

ansuz' ghetto markup language, or, if that offends you: `ansuz' ghetto markup language`.

## Why?

I wanted a really, really tiny language for a configuration file, so I made one.

`agml` is based on some work by [kpcyrd](https://github.com/kpcyrd). The comment syntax was designed in part by [prurigro](https://github.com/prurigro).

It started off as a bit of a joke, but as it turns out, the language has some nice properties.

1. It's extremely easy to read.
2. It parses each line as either a valid attribute or a comment, and never complains, which puts it well in line with the philosophy of [literate programming](http://en.wikipedia.org/wiki/Literate_programming).
3. Depending on the implementation (afaik this is currently the only one) you can call it with options that make it able to parse other configuration language like [ini](http://en.wikipedia.org/wiki/INI_file).
4. You don't need to parse a full file to append new values to it, as you would with json or xml, a property which lends itself well to many applications.

## Why not?

AGML was designed to be tiny, and simple. As such, it will not be suitable for all tasks.

If your project requires a configuration format that permits nested data structures, move on now.

## Is AGML stable?

I wrote this really quickly, and started taking it more seriously after the fact. A few people have asked when to expect an RFC, (an entertaining thought). I plan to push a few selfish designs, then open up to more input.

Once that RFC comes in, things should stay pretty stable.

## The current specification

AGML comes in two forms:

### 1 :: Quick and Dirty AGML

```
just start writing

you don't need to do anything more

this is a key : this is a value

This is another key : this is another value

this is a key : this value overwrites previous values with identical keys
```

What does that return?

```
[
  {
    "this is a key":"this value overwrites previous values with identical keys",
    "This is another key":"this is another value"
  }
]
```

### 2 :: Delimited AGML

```
---

this is useful if you want to pass a large body of text

and have the parser only bother with a small piece of it

start and end a block with three consecutive dashes, it'll ignore everything else.

I use this for annotating my markdown with metadata.

for bonus points, you can space out your lines like this, and it'll parse as valid Markdown

Those triple dashes render as an hr element

title: AGML

author: ansuz

description: ansuz' ghetto markup language

---

And then I put blog content below.

`key:value` <- this won't be parsed as AGML, since it isn't within the block.
```

That will return:

```
[
  {
    title:"AGML",
    author:"ansuz",
    description:"ansuz' ghetto markup language"
  }
]
```

### 2b :: Multiply delimited AGML

```
---

for situations when you want a collection of data

put multiple blocks, and they will be collected into the returned array

I use this for an AGML to RSS utility

the first block specifies my channel data

title: transitiontech.ca

link : http://transitiontech.ca

description : ansuz' blag

category : technology

generator : AGML2RSS

---

Then you can drop in the actual RSS items

---
title : one
link  : http://transitiontech.ca/one
description : my first blag post
---

---
title : two
link  : http://transitiontech.ca/two
description : my second blag post
---

---
title : three
link  : http://transitiontech.ca/three
description : my third blag post
---
```

This will return

```
[
  {
    title:"transitiontech.ca",
    link:"http://transitiontech.ca",
    description:"ansuz' blag",
    category:"technology",
    generator:"AGML2RSS"
  },
  {
    title:"one",
    link:"http:/transitiontech.ca/one",
    description:"my first blag post"
  },
  {
    title:"two",
    link:"http:/transitiontech.ca/two",
    description:"my second blag post"
  },
  {
    title:"three",
    link:"http:/transitiontech.ca/three",
    description:"my third blag post"
  }
]
```

To work with this data, I just make two assignments:

```
var channelData=myAGML[0];
var itemData=myAGML.slice(1);
```

With an AGML to XML converter (which is pretty easy), you can just append new posts to a `.agml` file, no parsing required.

It would also be trivial to implement some logic to only use the last `n` posts, if the number of posts is greater than `n`, but that's beyond the scope of this writeup.

## How?

```Javascript
var agml=require("./agml");

var results={};

agml.parse(yourText,results);

console.log(results);
```
