var agml=require("../agml");

var input=function(){/*
---
pew : pew
pew : pew
bang bang : pew pew
ansuz: a cool guy!
minatour: a cool lady!
---

*/}.toString().slice(14,-3);

console.log(input);

agml.destructive=false;

agml.parse(input);

console.log(JSON.stringify(agml.results,undefined,2));

console.log(agml.encode());
