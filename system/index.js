var app = require('../index');
var express = require('express');

exports.createRouterFromJson=function createRouterFromJson(json,router){
    if(Array.isArray(json)){
        if(router==undefined){
            for(var i=0;i<json.length;i++)
                app.use(createRouterFromJson(json[i],express.Router({mergeParams:true})));
        }else{
            for(var i=0;i<json.length;i++)
                router = createRouterFromJson(json[i],router);
        }
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
            var routerSub = createRouterFromJson(json.children,newRouter);
            if(json.path)
                router.use(json.path,routerSub);
            else
                router.use(routerSub);
        }
    }
    return router;
}