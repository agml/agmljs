var fs=require("fs");
var agml=require("../agml");

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
        return dict[temp]||'';
    });
};

rss.makeTag=function(type,content,indent){
    indent=indent||1;
    var outertabs='';
    var innertabs='\t';

    for(i=1;i<indent;i++){
        innertabs+='\t';
        outertabs+='\t';
    }

    return swap(outertabs+'<{type}>\n{content}\n'+outertabs+'</{type}>',{
        type:type,
        content:Object.keys(content)
        .map(function(key){
            return swap(innertabs+'<{key}>{val}</{key}>',{
                key:key,
                val:content[key]
            });
        }).join("\n") //+outertabs)
    });
};

rss.makeFeed=function(source){
    var results=[];
    agml.parse(source,results);
    var channel=results[0];
    var items=results.slice(1);
    var channelXML=rss.makeTag('channel',channel,2);
    var itemsXML=items.map(function(item){

        return rss.makeTag('item',item,2);
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
