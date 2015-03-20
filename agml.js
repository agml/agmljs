var agml={};

/*
  agml parse takes three arguments
    a string to parse
    an object in which results will be accumulated
    another object in which options can be passed
      and returns an object or results

    the options object can include:
      an alternative key-value delimiter
      an alternative trailing comment character
*/

agml.parse=function(text,results,opt){
  // objects are passed by reference in javascript
  // so you can pass an object like a pointer in C
  // and agml.parse will load the results into that
  results=results||{};
  opt=opt||{};
  opt.delim=opt.delim||':';
  opt.trail=opt.trail||';';

  var leadingComment=new RegExp('^\\s*'+opt.delim);
  var keyPattern=new RegExp('.*?'+opt.delim);
  var trailingComment=new RegExp(opt.trail+'.*$');

  // split into individual lines
  // agml can't split key-value pairs across lines
  text.split('\n')
    // throw away empty lines, or lines with whitespace as keys
    .filter(function(line){
      return (!line || leadingComment.test(line))?false:true;
    })
    // parse each line
    .forEach(function(line){
      // a line is only relevant if it contains a colon
      if(/:/.test(line)){
        var key,val;
        // extract the key, assign the remainder to the value
        val=line.replace(keyPattern,function(k){
          // but don't keep the colon
          key=k.slice(0,-1);
          return '';
          // also, throw away anything after a semicolon
        }).replace(trailingComment,'');
        // add your results to a dictionary
        results[key.trim()]=val.trim();
      }
    });
  return results;
};

/*
  agml.encode takes a dictionary, and an object of options
    and returns a string

  the options object can include an alternate delimiter
    instead of the default colon
*/

agml.encode=function(dict,opt){
  opt=opt||{};
  opt.delim=opt.delim||':';
  return Object.keys(dict)
    .map(function(key){
      return key+opt.delim+dict[key];
    }).join('\n');
};

/*
  agml.head takes a string, a results object, and an options object
    and returns an array
*/

agml.head=function(text,results,opt){
  /*
      parse a section of text
      filter out bits contained in '---' blocks
      extract the data, return the text
  */
  opt.delim=opt.delim||'-';

  var results=[];
  return text.replace(new RegExp('\\'+opt.delim+'{3}(.|\s)*?\\'+opt.delim+'{3}','mg'),function(head){
    results.push(head.slice(3,-3));
    return '';
  });
  return results;
};

module.exports=agml;
