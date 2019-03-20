import Feather from "./feather";

export class Session implements Feather{
    attach(settings:any,options:any,root:string,app:any){
        if(settings.session){
            var sessionConfig=settings.session;
            var expressSession = require('express-session');
            //make sure redis is running before starting your application
            if(settings.redis){
                var RedisStore = require('connect-redis')(expressSession);
                sessionConfig.store=new RedisStore(settings.redis);
            }
            app.use(expressSession(sessionConfig));
            if(options.flash){
                app.use(require("connect-flash")(settings.flash));
                const {view}=require(root+'/utils');
                app.use(function(req:any,res:any,next:any){
                    res.locals.request=req;//provide access to request object from response
                    res.locals.view=view;//utility functions for view
                    //old function to access old data
                    var old=req.flash('_old_');
                    old=old.length?old[0]:{};
                    res.locals.old=(prop:any,default_data:any)=>(old[prop]==undefined)?default_data:old[prop];
                    next();
                });
            }
        }
    }
}