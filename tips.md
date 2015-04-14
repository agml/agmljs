---

title: tips

author: ansuz

description : some cool stuff you can do with agml

---

### Multiline values

By default, the AGML parser looks at individual lines to find key-value pairs. This causes problems if you want to include multiline values.

To override this behaviour, pass a different `separator` option. It comes in the form of a string, so if you want to delimit _lines_ of agml by double-newlines, instead of the default single, pass the following option:

```JSON
{
  separator:"\n\n"
}
```

A multiline value

```AGML
---

someKey: now you can have
a multiline value
in your agml
pretty cool, right?

---
```


###  Markdown blocks as values

Markdown treats double-newlines as significant, so if you want to be able to pass sections of markdown as values, you'll need to change your `separator` value to ignore double-newlines:

```JSON
{
  separator:"\n\n\n"
}
```

Markdown in your AGML

```AGML
---

navigation:
* [a link](http://example.tld)
* [another link](http://gfy.com)


that's all, folks!

---
```
