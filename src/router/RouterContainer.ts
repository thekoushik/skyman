import { scanFiles } from "../utils";

export class RouterContainer{
    private controllers:any={};
    private middlewares:any={};
    private errorHandlers:any={};

    public getControllerEndpoint(name:string):any{
        if(typeof name=="function")
            return name;
        var [controller_name,fn]=name.split(".",2);
        if(!this.controllers[controller_name]) throw new Error("Controller '"+controller_name+"' not found");
        if(!this.controllers[controller_name][fn]) throw new Error("Endpoint '"+fn+"' not found in '"+controller_name+"'");
        return this.controllers[controller_name][fn];
    }
    public getMiddlewareEndpoint(name:string):any{
        if(Array.isArray(name)){
            return name.map(this.getMiddlewareEndpoint.bind(this))
        }else{
            if(typeof name=="function")
                return name;
            var [middleware_name,fn]=name.split(".",2);
            if(!this.middlewares[middleware_name]) throw new Error("Middleware '"+middleware_name+"' not found");
            if(!this.middlewares[middleware_name][fn]) throw new Error("Endpoint '"+fn+"' not found in '"+middleware_name+"'");
            return this.middlewares[middleware_name][fn];
        }
    }

    load(root:string){
        scanFiles(root+'/controllers').forEach((c)=>{
            this.controllers[c]=require(root+'/controllers/'+c);
        });
        scanFiles(root+'/middlewares').forEach((c)=>{
            this.middlewares[c]=require(root+'/middlewares/'+c);
        })
    }
}