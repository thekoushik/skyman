//import AuthProvider from './AuthProvider';
var LocalStrategy = require('passport-local').Strategy;

export default (passport:any,settings:any):void=>{
    passport.use(new LocalStrategy(settings.fields,(username:any,password:any,doneCallback:any)=>{
        //doneCallback(null,user)//success
        //doneCallback(null,null)//bad or username missing
        //doneCallback(new Error("Internal Error!"))//internal error
        settings.provider.getUserByCredentials(username,password)
        .then((user:any)=>{
            if(!user)
                doneCallback(null,false,{message:'Wrong credential'});
            /*else if(user.account_expired)
                doneCallback(null,false,{message:'Account has expired'});
            else if(user.credential_expired)
                doneCallback(null,false,{message:'Your credential has expired'});
            else if(!user.enabled)
                doneCallback(null,false,{message:'Account is not activated'});
            else if(user.account_locked)
                doneCallback(null,false,{message:'Account is locked'});*/
            else
                doneCallback(null,user);
        })
        .catch((err:any)=>{
            doneCallback(err);
        });
    }));
    passport.serializeUser((user:any,doneCallback:any)=>{
        doneCallback(null, settings.provider.getUserID(user));//._id
    });
    passport.deserializeUser((id:any, doneCallback:any)=>{
        settings.provider.getUserById(id)
        .then((user:any)=>{
            doneCallback(null,user);
        })
        .catch((err:any)=>{
            doneCallback(new Error("Internal Error!"));
        });
    });
}