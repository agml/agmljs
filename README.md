# agmljs

ansuz' ghetto markup language

## Why?

I wanted a really, really tiny language for a configuration file, so I made one.

`agml` is based on some work by [kpcyrd](https://github.com/kpcyrd). The comment syntax was designed in part by [prurigro](https://github.com/prurigro).

## How?

```Javascript
var agml=require("./agml");

var yourResults=agml.parse(yourText);

console.log(yourResults);
```

## What?!?

```Javascript
var aMultiLineString=function(){/*

a key : a value

another key : another value ; this is a comment, since it's after a semicolon


: a comment

; another comment

this is a comment too, since there's no colon

*/}.toString().slice(14,-3);
```

## Huh?

That will yield the following:

```agml
{
  "a key": "a value",
  "another key": "another value"
}
```
