var agml=require("../agml");

var text=function(){/*

key : value

key2 : value

this is a comment

; this is a comment too

: this is also a comment

: thisIsNotAKey : thisIsNotAValue

  this is valid : this is valid too ; this is a comment

;   pew pew pew

*/}.toString().slice(14,-3);

agml.parse(text);

console.log(JSON.stringify(agml.results,undefined,2));
