var agml={
  results:[],
  block:'-',
  trail:';',
  delim:':',
  replace:true,
  firstOnly:false,
  separator:'\n',
  destructive:true
};

/*
  agml parse takes three arguments
    a source string
    a results array
    an options object

    it returns the original source string, minus any blocks of delimited AGML

    the options object can include:
      an alternative key-value delimiter, (agml.delim)
      an alternative trailing comment character (agml.trail)
      an alternative character for AGML blocks (agml.block)
      an alternative string which should be used to delimit lines (agml.separator)
      a flag which indicates whether to replace blocks of AGML (agml.replace)
      a flag which indicates whether the parser should destroy or preserve duplicate keys (agml.destructive)
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
  var destructive=(typeof opt.destructive === 'undefined')?
    agml.destructive:
    opt.destructive;

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
          // first check if you're in destructive mode
          if(destructive){
            // insert the value into the dictionary
            // and overwrite any previous values
            temp[key.trim()]=val.trim();
          }else{
            // in non-destructive mode, all values are arrays of strings
            // cache the key
            key=key.trim();
            if(!temp[key]){
              // initialize the array if not exists
              temp[key]=[];
            }
            // push the new value to the array
            temp[key].push(val.trim());
          }
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

agml.encode=function(blocks,opt){
  opt=opt||{};
  var delim=opt.delim||agml.delim;
  var s=opt.separator||agml.separator; // \n
  var b=opt.block||agml.block;
  b+=(b+b+s+s);

  return agmlBlocks.map(function(agmlBlock){
    return b+
      Object.keys(agmlBlock)
        .map(function(key){
          return key+delim+agmlBlock[key];
        }).join(s)+b;
  });
};

module.exports=agml;
