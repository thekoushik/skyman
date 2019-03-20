import Feather from '../Feather';
import AuthProvider from './AuthProvider';
import loadLocalStrategy from './local';
const passport=require('passport');

class DefaultAuthProvider implements AuthProvider{
    getUserByCredentials(username:string,password:string):Promise<any>{
        if(username=="skyman" && password=="skyman")
            return Promise.resolve({id:username});
        else
            return Promise.reject(null);
    }
    getUserById(id:any):Promise<any>{
        return Promise.resolve({id:id});
    }
    getUserID(user:any):any{
        return user.id;
    }
}
const SupportedStrategies:any={
    local:loadLocalStrategy
};

export class Auth implements Feather{
    private settings:any;
    driver:any;
    attach(settings:any,options:any,root:string,app:any){
        this.settings=settings.auth;
        if(!settings.auth) return;
        if(!SupportedStrategies[this.settings.strategy.toLowerCase()])
            throw new Error('Unsupported strategy: '+this.settings.strategy);
        if(this.settings.provider=='default')
            this.settings.provider=new DefaultAuthProvider()
        else{
            this.settings.provider=require(root+"/database/providers/"+this.settings.provider);
        }
        app.use(passport.initialize());
        app.use(passport.session());
        SupportedStrategies[this.settings.strategy.toLowerCase()](passport,this.settings);
    }
    static authenticate(req:any,res:any,next:any,cb:Function):void{
        passport.authenticate('local',cb)(req,res,next);
    }
}