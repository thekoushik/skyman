var app = require('../index');
//setup
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var helmet = require('helmet');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const config=global.config=require('../config')[process.env.mode || 'development'];

var sessionConfig={
    secret:process.env.SESSION_SECRET || "verysecret",
    resave: true,
    saveUninitialized: true
};

if(config.redis){
    var RedisStore = require('connect-redis')(expressSession);
    sessionConfig.store=new RedisStore(config.redis);
}

app.use(expressSession(sessionConfig));

app.use(require('connect-flash')());
//end setup
app.use(passport.initialize());
app.use(passport.session());

const {view}=require('../utils');
//custom middleware
app.use(function(req,res,next){
    res.locals.request=req;//provide access to request object from response
    res.locals.view=view;//utility functions for view

    //old function to access old data
    var old=req.flash('_old_');
    old=old.length?old[0]:{};
    res.locals.old=(prop,default_data)=>(old[prop]==undefined)?default_data:old[prop];

    next();
});

/*
Usage:
    throw make404()
*/
global.make404=(msg)=>{
    var err=new Error(msg || "Page not found");
    err.code = '404';
    return err;
}
global.goBackWithData=(req,res)=>{
    req.flash('_old_',req.body);
    return res.redirect('back');
}

//connect to database
require('../database/connector').connect();
var {user_service} = require('../database/services');

passport.use(new passportLocal.Strategy((username,password,doneCallback)=>{
    //access db and fetch user by username and password
    /*
    doneCallback(null,user)//success
    doneCallback(null,null)//bad or username missing
    doneCallback(new Error("Internal Error!"))//internal error
    */
    user_service.getUserByCredentials(username,password)
    .then((user)=>{
        if(!user)
            doneCallback(null,false,{message:'Wrong credential'});
        else if(user.account_expired)
            doneCallback(null,false,{message:'Account has expired'});
        else if(user.credential_expired)
            doneCallback(null,false,{message:'Your credential has expired'});
        else if(!user.enabled)
            doneCallback(null,false,{message:'Account is not activated'});
        else if(user.account_locked)
            doneCallback(null,false,{message:'Account is locked'});
        else
            doneCallback(null,user);
    })
    .catch((err)=>{
        doneCallback(err);
    });
}));
passport.serializeUser((user,doneCallback)=>{
    doneCallback(null, user._id);
});
passport.deserializeUser((id, doneCallback)=>{
    user_service.getUser(id)
    .then((user)=>{
        doneCallback(null,user);
    })
    .catch((err)=>{
        doneCallback(new Error("Internal Error!"));
    });
});

exports.authenticateLogin=(req,res,next,cb)=>{
    passport.authenticate('local',cb)(req,res,next);
};