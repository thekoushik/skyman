/**
 * 
 */
export interface Settings{
    statics?:Record<string,string>;
    bodyparser?:any;
    cookieparser?:any;
    helmet?:any;
    session?:any;
    redis?:boolean;
    flash?:any;
    auth?:any;
    view?:any;
    db?:any;
}
/**
 * 
 */
export const DefaultSettings:Settings={
    statics:{
        "/static":"static"
    },
    bodyparser:{
        json:{limit:'10mb'},
        urlencoded:{ extended: true,limit:'10mb',parameterLimit: 1000000 }
    },
    cookieparser:{},
    helmet:{},
    session:{
        secret: "skymansecret",
        resave: true,
        saveUninitialized: true,
    },
    redis:false,
    flash:{},
    auth:{
        strategy:"local",
        fields:{
            usernameField:"username",
            passwordField:"password",
        },
        provider:'default',
    },
    view:{
        autoescape: true
    },
    db:{
        directory:"database",
        nosql:true
    }
}