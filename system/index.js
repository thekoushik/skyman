var express = require('express');

function parseJSONRoutes(json,router){
    if(Array.isArray(json)){
        for(var i=0;i<json.length;i++)
            parseJSONRoutes(json[i],router);
    }else if(!json.path && json.controller){
        router.use(json.controller);
    }else{
        if(json.controller){
            var stack=((json.middleware)?json.middleware.concat(json.controller) :[json.controller]);
            if(json.path)
                stack.unshift(json.path);
            router[(json.method==undefined)?"get":json.method].apply(router,stack);
        }else if(Array.isArray(json.children)){
            var newRouter=express.Router({mergeParams:true});
            if(json.middleware)
                newRouter.use(json.middleware);
            parseJSONRoutes(json.children,newRouter);
            if(json.path)
                router.use(json.path,newRouter);
            else
                router.use(newRouter);
        }
    }
}

exports.createRouterFromJson=function(json){
    var router=express.Router({mergeParams:true});
    parseJSONRoutes(json,router);
    return router;
}