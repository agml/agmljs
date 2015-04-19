var agml=require("../agml");

var source=function(){/*
---
a:5
b:6
c:7
---

---
d:8
e:9
f:A
---
*/}.toString().slice(14,-3);

console.log(source);

var results=[];

agml.parse(source,results);

console.log(results);

// now re-encode it

var encoded=agml.encode(results);

encoded.forEach(function(block){
  console.log(block);
});
