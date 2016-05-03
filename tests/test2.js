var agml=require("../agml");

var text=function(){/*
---
a : bang!
b : pewpew
---

---
a:  bloppp
b: !zing™


this is valid : this is valid too ; this is a comment

---

some extra stuff

this resembles a key : but it is not

*/}.toString().slice(14,-3);

agml.parse(text);

console.log(JSON.stringify(agml.results,undefined,2));
