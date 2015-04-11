var agml=require("./agml");

var text=function(){/*
a : bang!
b : pewpew
b : non destructive mode makes everything an array

*/}.toString().slice(14,-3);

agml.parse(text,undefined,{
  destructive:false // disable destructive mode
});

console.log(JSON.stringify(agml.results,undefined,2));
