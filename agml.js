var agml={
  results:[],
  block:'-',
  trail:';',
  delim:':',
  replace:true,
  firstOnly:false,
  separator:'\n'
};

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

  results=results||agml.results; 
  opt=opt||{};
  var delim=opt.delim||agml.delim;
  var trail=opt.trail||agml.trail;
  var block=opt.block||agml.block;
  var replace=opt.replace||agml.replace;
  var separator=opt.separator||agml.separator;

  // if opt.firstOnly has any truthy value
  // the agmlBlock regex will only grab the first block
  // otherwise it will grab all blocks
  var blockFlags=opt.firstOnly?'m':'mg';

  var leadingComment=new RegExp('^\\s*'+delim);
  var keyPattern=new RegExp('.*?'+delim);
  var trailingComment=new RegExp(trail+'.*$');
  var agmlBlock= new RegExp('\\'+block+'{3}(.|\s|\n)+?\\'+block+'{3}',blockFlags);

  var toJSON=function(AGML){
    var temp={};

    // split into individual lines
    // agml can't split key-value pairs across lines
    AGML.split(separator) // defaults to '\n' (newline)
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
          temp[key.trim()]=val.trim();
        }
      });
    results.push(temp);
  };

  // if you detect at least one delimited block of AGML
  // just parse that, and (optionally) remove it from the text
  if(agmlBlock.test(text)){
    (function(){
      // a temporary array
      var temp=[];

      // parse out the content of the blocks
      var tempText=text.replace(agmlBlock,function(block){
        temp.push(block.slice(3,-3));  
      });

      // call 'toJSON' on each block
      // this pushes to your results array
      temp.forEach(toJSON);

      // unless explicitly instructed not to
      // erase the parsed blocks from the source text
      if(replace){
        text=tempText;
      }
    }());
  }else{
    // just extract the values
    // don't do anything to the source text
    toJSON(text);
  }
};

/*
  agml.encode takes a dictionary, and an object of options
    and returns a string

  the options object can include an alternate delimiter
    instead of the default colon
*/

agml.encode=function(dict,opt){
  opt=opt||{};
  var delim=opt.delim||agml.delim;
  var separator=opt.separator||agml.separator; \\ \n

  return Object.keys(dict)
    .map(function(key){
      return key+opt.delim+dict[key];
    }).join(separator);
};

module.exports=agml;
