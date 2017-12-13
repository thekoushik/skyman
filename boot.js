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
var csrfProtection=exports.csrfProtection = csrf({ cookie: true });

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

const config = require('./config');

var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
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

let mailTransporter = require('nodemailer').createTransport(config.email);
const noMail=false;//no mail for quick testing

var sendEmail=exports.sendEmail=(to,subject,html,from=config.email.auth.user)=>{
    if(noMail) return html;
    return mailTransporter.sendMail({
        from: from,
        to: to, 
        subject: subject,
        html: html
    })
}
exports.sendEmailConfirm=(to,url)=>{
    return new Promise((resolve,reject)=>{
        require('nunjucks').render('email/confirm.html',{url:url},(err,str)=>{
            if(err) reject(err);
            else resolve(sendEmail(to,'Account Verification',str))
        })
    })
}
exports.sendEmailForgot=(to,url)=>{
    return new Promise((resolve,reject)=>{
        require('nunjucks').render('email/forgot.html',{url:url},(err,str)=>{
            if(err) reject(err);
            else resolve(sendEmail(to,'Reset Password',str))
        })
    })
}