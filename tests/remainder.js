var agml=require("../agml.js");

var S=function(){/*
---

this: is
agml: bro

---

this is not!

*/}.toString().slice(14,-3);

var rem=agml.parse(S);

//console.log(agml);
console.log(agml.results);

console.log(rem);
