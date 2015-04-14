var fs=require("fs");
var agml=require("./agml");

var args=process.argv.slice(2);

if(args.length<1){
  console.log("Try passing the name of an agml file");
  process.exit();
}

var source=args.map(function(fn){
  return fs.readFileSync(fn,'utf-8');
});

var rss={};

var swap=function(text,dict){
  return text.replace(/\{.*?\}/g,function(key){
    var temp=key.slice(1,-1);
    return dict[temp]||'ERR';
  });
};

rss.makeTag=function(type,content){
  return swap('<{type}>\n\t{content}\n</{type}>',{
    type:type,
    content:Object.keys(content)
    .map(function(key){
      return swap('<{key}>{val}</{key}>',{
        key:key,
        val:content[key]
      });
    }).join("\n\t")
  });
};

rss.makeFeed=function(source){
  var results=[];
  agml.parse(source,results);
  var channel=results[0];
  var items=results.slice(1);
//  console.log(JSON.stringify(results,undefined,2));
  var channelXML=rss.makeTag('channel',channel);
  var itemsXML=items.map(function(item){

    return rss.makeTag('item',item);
  }).join("\n");

  var frame=function(){/*<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
{channel}
{items}
</rss>
*/}.toString().slice(14,-3);

  var final=swap(frame,{
    channel:channelXML,
    items:itemsXML
  });

  return final;
};

source.map(function(source){
  console.log(rss.makeFeed(source));
});
