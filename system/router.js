var express = require('express');
var {scanFiles}=require('../utils');
var controllers={};
var middlewares={};
scanFiles('controllers').forEach((c)=>{
    controllers[c]=require('../controllers/'+c);
});
scanFiles('middlewares').forEach((c)=>{
    middlewares[c]=require('../middlewares/'+c);
});

var getControllerEndpoint=(name)=>{
    if(typeof name=="function")
        return name;
    var [controller_name,fn]=name.split(".",2);
    if(!controllers[controller_name]) throw new Error("Controller '"+controller_name+"' not found");
    if(!controllers[controller_name][fn]) throw new Error("Endpoint '"+fn+"' not found in '"+controller_name+"'");
    return controllers[controller_name][fn];
}
var getMiddlewareEndpoint=(name)=>{
    if(Array.isArray(name)){
        return name.map(getMiddlewareEndpoint)
    }else{
        if(typeof name=="function")
            return name;
        var [middleware_name,fn]=name.split(".",2);
        if(!middlewares[middleware_name]) throw new Error("Middleware '"+middleware_name+"' not found");
        if(!middlewares[middleware_name][fn]) throw new Error("Endpoint '"+fn+"' not found in '"+middleware_name+"'");
        return middlewares[middleware_name][fn];
    }
}

//TODO: automatic/default errorHandler and notFoundHandler for array routes
function parseJSONRoutes(json,router,errorHandler,notFoundHandler){
    if(Array.isArray(json)){
        for(var i=0;i<json.length;i++)
            parseJSONRoutes(json[i],router);
    }else if(!json.path && json.controller){
        router.use(getControllerEndpoint(json.controller));
    }else{
        if(json.controller){
            var stack=json.path!=undefined?[json.path]:[];
            if(json.middleware){
                if(Array.isArray(json.middleware))
                    stack=stack.concat(getMiddlewareEndpoint(json.middleware));
                else
                    stack.push(getMiddlewareEndpoint(json.middleware));
            }
            stack.push(getControllerEndpoint(json.controller));
            router[(json.method==undefined)?"get":json.method].apply(router,stack);
        }else if(Array.isArray(json.children)){
            var newRouter=express.Router({mergeParams:true});
            if(json.middleware){
                if(Array.isArray(json.middleware))
                    getMiddlewareEndpoint(json.middleware).forEach((f)=>newRouter.use(f));
                else
                    newRouter.use(getMiddlewareEndpoint(json.middleware));
            }
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