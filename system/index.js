var app = require('../index');
var express = require('express');

function createRouterFromJson(json,router){
    if(Array.isArray(json)){
        if(router==undefined){
            for(var i=0;i<json.length;i++)
                app.use(createRouterFromJson(json[i],express.Router()));
        }else{
            for(var i=0;i<json.length;i++)
                router = createRouterFromJson(json[i],router);
            return router;
        }
    }else if(json.use){
        router.use(json.use);
        return router;
    }else{
        if(json.stack){
            var stack=json.stack;
            if(json.path) stack.unshift(json.path);
            router[(json.method==undefined)?"get":json.method].apply(router,stack);
        }else if(Array.isArray(json.children)){
            var routerSub = createRouterFromJson(json.children,express.Router());
            if(json.path) router.use(json.path,routerSub);
            else router.use(routerSub);
        }
        return router;
    }
}

module.exports.createRouterFromJson=createRouterFromJson;