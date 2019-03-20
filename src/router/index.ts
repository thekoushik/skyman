let express=require('express');
import Feather from "../Feather";
import {joinURLs} from '../utils';
import { RouterContainer } from "./RouterContainer";

/**
 * 
 */
export class Router implements Feather{
    private container:RouterContainer=new RouterContainer();
    private router:any;
    static routerTree:any={};

    private addToTree(baseURL:string,json:any,method:string):void{
        let url=joinURLs(baseURL,json.path);
        if(!Router.routerTree[url]) Router.routerTree[url]={};
        if(Router.routerTree[url][method]) throw new Error("Path "+url+" already exist");
        Router.routerTree[url][method]={
            description: json.description || "",
            operationId: json.operationId || "",
            parameters: [],
            responses: {}
        }
    }
    private parseJSONRoutes(json:any,router:any,baseURL:string/*errorHandler?:any,notFoundHandler?:any*/):any{
        if(Array.isArray(json)){
            for(var i=0;i<json.length;i++)
            this.parseJSONRoutes(json[i],router,baseURL);
        }else if(!json.path && json.controller){
            router.use(this.container.getControllerEndpoint(json.controller));
        }else{
            let method=(json.method==undefined)?"get":json.method;
            if(json.controller){
                let stack=[];
                if(json.path){
                    this.addToTree(baseURL,json,method);
                    stack.push(json.path);
                }
                if(json.middleware){
                    if(Array.isArray(json.middleware))
                        stack=stack.concat(this.container.getMiddlewareEndpoint(json.middleware));
                    else
                        stack.push(this.container.getMiddlewareEndpoint(json.middleware));
                }
                stack.push(this.container.getControllerEndpoint(json.controller));
                router[method].apply(router,stack);
            }else if(Array.isArray(json.children)){
                var newRouter=express.Router({mergeParams:true});
                if(json.middleware){
                    if(Array.isArray(json.middleware))
                        this.container.getMiddlewareEndpoint(json.middleware).forEach((f:any)=>newRouter.use(f));
                    else
                        newRouter.use(this.container.getMiddlewareEndpoint(json.middleware));
                }
                this.parseJSONRoutes(json.children,newRouter,joinURLs(baseURL,json.path||""));
                if(json.path)
                    router.use(json.path,newRouter);
                else
                    router.use(newRouter);
            }else if(json.view){
                let stack:any=[];
                if(json.path){
                    this.addToTree(baseURL,json,method);
                    stack.push(json.path);
                }
                stack.push((req:any,res:any)=>res.render(json.view));
                router[method].apply(router,stack);
            }else if(json.redirect){
                if(!json.path) throw new Error("Redirect requires path");
                if(json.method==undefined) method='all';
                router[method](json.path,(req:any,res:any)=>res.redirect(json.redirect));
            }
        }
    }
    getRouter():any{
        return this.router;
    }
    attach(settings:any,options:any,root:string,app:any){
        this.container.load(root);
        this.router=express.Router({mergeParams:true});
        var json=require(root+'/routes');
        this.parseJSONRoutes(json,this.router,"");
        app.use(this.router);
    }
}