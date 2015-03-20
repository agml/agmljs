var agml={};

/*
  agml parse takes three arguments
    a string to parse
    an object in which results will be accumulated
    another object in which options can be passed
*/

agml.parse=function(text,results,options){
  // objects are passed by reference in javascript
  // so you can pass an object like a pointer in C
  // and agml.parse will load the results into that
  results=results||{};
  options=options||{};

  // split into individual lines
  // agml can't split key-value pairs across lines
  text.split('\n')
    // throw away empty lines, or lines with whitespace as keys
    .filter(function(line){
      return (!line || /^\s*:/.test(line))?false:true;
    })
    // parse each line
    .forEach(function(line){
      // a line is only relevant if it contains a colon
      if(/:/.test(line)){
        var key,val;
        // extract the key, assign the remainder to the value
        val=line.replace(/.*?:/,function(k){
          // but don't keep the colon
          key=k.slice(0,-1);
          return '';
          // also, throw away anything after a semicolon
        }).replace(/;.*$/,'');
        // add your results to a dictionary
        results[key.trim()]=val.trim();
      }
    });
  return results;
};

/*
  agml.head has the same signature as agml.parse

*/
agml.head=function(text,results,options){
  /*
      parse a section of text
      filter out bits contained in '---' blocks
      extract the data, return the text
  */
  var results=[];
  return text.replace(/\-{3}(.|\s)*?\-{3}/mg,function(head){
    results.push(head.slice(3,-3));
    return '';
  });
  return results;
};

module.exports=agml;
