var app = require('./index');
//setup
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);//////disable this line for Without Redis
var passport = require('passport');
var passportLocal = require('passport-local');
var helmet = require('helmet');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const config = require('./config');

app.use(expressSession({
    secret:process.env.SESSION_SECRET || "verysecret",
    resave: true,
    saveUninitialized: true,
    store: new RedisStore(config.redis)/////////////////////////disable this line for Without Redis
}));

app.use(require('connect-flash')());
//end setup
app.use(passport.initialize());
app.use(passport.session());

const view=require('./utils').view;
//custom middleware
app.use(function(req,res,next){
    res.locals.request=req;//provide access to request object from response
    res.locals.view=view;//utility functions for view
    next();
})

var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
mongoose.plugin((schema, options)=>{
    var indexes=schema.indexes();
    if(indexes.length==0) return;
    var postHook=(error, _, next)=>{
        if(error.name=='MongoError' && error.code==11000){
            var regex=/index: (.+) dup key:/;
            var matches=regex.exec(error.message);
            if(matches){
                matches=matches[1];
                for(var i=0;i<indexes.length;i++){
                    for(var field in indexes[i][0])
                        if(indexes[i][1].unique && matches.indexOf('$'+field)>0){
                            var e={}
                            e[field]=new mongoose.Error.ValidatorError({
                                type: 'unique',
                                path: field,
                                message: field+' already exist'
                            })
                            var newError = new mongoose.Error.ValidationError();
                            newError.errors = e;
                            return next(newError);
                        }
                }
            }
        }
        next(error);
    }
    schema.post('save', postHook);
    schema.post('update', postHook);
    schema.post('findOneAndUpdate', postHook);
})
mongoose.connect(config.mongoURI,{ useMongoClient: true}).then(()=>{
    require('./seeders').seed();
})

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