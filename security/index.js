var app = require('../index');

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
app.use(expressSession({
    secret:process.env.SESSION_SECRET || "verysecret",
    resave: true,
    saveUninitialized: true 
}));

app.use(passport.initialize());
app.use(passport.session());

var User = require('../models').user;
const utils = require('../utils');

passport.use(new passportLocal.Strategy(function(username,password,doneCallback){
    //access db and fetch user by username and password
    /*
    doneCallback(null,user)//success
    doneCallback(null,null)//bad or username missing
    doneCallback(new Error("Internal Error!"))//internal error
    */
    User.find({username: username,password:password,enabled:true },utils.userDTOProps,function(err,docs){
        if(err) doneCallback(new Error("Internal Error!"));
        else if(docs.length==0) doneCallback(null,false,{message:'wrong'});
        else doneCallback(null,docs[0]);
    });
    /*if(username === password){
        doneCallback(null,{id:username,name:username});
    }else{
        doneCallback(null,false,{message:'wrong'});
    }*/
}));
passport.serializeUser(function(user,doneCallback){
    doneCallback(null, user._id);
});
passport.deserializeUser(function(id, doneCallback) {
  User.findById(id,utils.userDTOProps, function(err, user) {
    if(err) doneCallback(new Error("Internal Error!"));
    else doneCallback(null,user);
  });
});

var authenticateLogin=function(req,res,next,cb){
    passport.authenticate('local',cb)(req,res,next);
};

module.exports={
    authenticateLogin:authenticateLogin
};