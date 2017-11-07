var app = require('./index');
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

var csrf = require('csurf');
var csrfProtection=module.exports.csrfProtection = csrf({ cookie: true });

app.use(cookieParser());
app.use(expressSession({
    secret:process.env.SESSION_SECRET || "verysecret",
    resave: true,
    saveUninitialized: true 
}));

app.use(require('connect-flash')());
//end setup
app.use(passport.initialize());
app.use(passport.session());

var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
const mongoURI = 'mongodb://127.0.0.1/express-starter';
mongoose.connect(mongoURI,{ useMongoClient: true});

var user_service = require('./services').user_service;

passport.use(new passportLocal.Strategy((username,password,doneCallback)=>{
    //access db and fetch user by username and password
    /*
    doneCallback(null,user)//success
    doneCallback(null,null)//bad or username missing
    doneCallback(new Error("Internal Error!"))//internal error
    */
    user_service.getUserByCredentials(username,password)
    .then((user)=>{
        if(!user) doneCallback(null,false,{message:'Wrong credential'});
        if(!user.enabled)
            doneCallback(null,false,{message:'Account is not activated'});
        else if(!user.accountNonLocked)
            doneCallback(null,false,{message:'Account is locked'});
        else if(!user.accountNonExpired)
            doneCallback(null,false,{message:'Account has expired'});
        else if(!user.credentialsNonExpired)
            doneCallback(null,false,{message:'Your credential has expired'});
        else
            doneCallback(null,user);
    })
    .catch((err)=>{
        doneCallback(new Error("Internal Error!"));
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

module.exports.authenticateLogin=(req,res,next,cb)=>{
    passport.authenticate('local',cb)(req,res,next);
};
