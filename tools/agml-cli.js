var agml=require("../agml.js");

var args=process.argv.slice(2);

//console.log (args,args.length);

function read(){
    var buffer="";
    var target=[];

    var block=/\-{3}[^\-]*?\-{3}/;

    process.stdin.on('data',function(chunk){
        buffer+=(chunk);
        if(/\-{3}/.test(buffer)){
            // there may be a block of AGML present
            if(block.test(buffer)){
                buffer=agml.parse(buffer,target);
            }
        }
    });

    process.stdin.on('end',function(){
//        console.log(buffer);
        console.log(target);
    });
};

// read from stdin
read();
