var app = require('../index');
//setup
var bodyParser = require('body-parser');
var passport = require('passport');
var passportJWT = require('passport-jwt');
var passportLocalStrategy = require('passport-local').Strategy;
var passportAnonymousStrategy = require('passport-anonymous').Strategy;
var jwt = require('jsonwebtoken');
var helmet = require('helmet');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (mode == "development") {
    const morgan = require('morgan');
    app.use(morgan('tiny'));
}

app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        res.status(400).send({ status: false, message: "Bad Request" });
    } else next();
});

app.use((req, res, next) => {
    //console.log(req.headers);
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method == 'OPTIONS') res.end();
    else next();
});

//end setup
app.use(passport.initialize());

require('./helper');

//connect to database
require('../database/connector').connect();
var { user_provider } = require('../database').providers;
var { email_service } = require('../services');

passport.use(new passportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, doneCallback) => {
    try {
        const user = await user_provider.getUserByCredentials(username, password, req.body.role);
        if (!user)
            return doneCallback(null, false, { message: 'Wrong credential' });
        // else if (user.account_expired)
        //     doneCallback(null, false, { message: 'Account has expired' });
        // else if (user.credential_expired)
        //     doneCallback(null, false, { message: 'Your credential has expired' });
        else if (!user.enabled) {
            const newtoken = await user_provider.saveNewOTP(user._id)
            email_service.sendEmailConfirmUser(user.email, newtoken.token).then((_) => { }).catch(e => { })
            return doneCallback(null, false, { message: 'Account is not activated, OTP sent to email', extra: { otp: true } });
            //doneCallback(null, false, { message: 'Account is not activated' });
        } else if (user.account_locked)
            return doneCallback(null, false, { message: 'Account is locked' });
        else
            return doneCallback(null, user);
    } catch (e) {
        console.log(e);
        doneCallback(err);
    }
}));

passport.use(new passportJWT.Strategy({
    //issuer: config.auth.issuer,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.auth.secret
}, async (jwt_payload, doneCallback) => {
    //access db and fetch user by username and password
    /*
    doneCallback(null,user)//success
    doneCallback(null,null)//bad or username missing
    doneCallback(new Error("Internal Error!"))//internal error
    */
    try {
        const user = await user_provider.getUser(jwt_payload.sub)
        if (!user)
            return doneCallback(null, false, { message: 'Wrong credential' });
        // if (user.account_expired)
        //     return doneCallback(null, false, { message: 'Account has expired' });
        // if (user.credential_expired)
        //     return doneCallback(null, false, { message: 'Your credential has expired' });
        if (!user.enabled)
            return doneCallback(null, false, { message: 'Account is not activated' });
        if (user.account_locked)
            return doneCallback(null, false, { message: 'Account is locked' });
        doneCallback(null, user);
    } catch (err) {
        doneCallback(err);
    }
}));
passport.use(new passportAnonymousStrategy());
passport.serializeUser((user, doneCallback) => {
    doneCallback(null, user._id);
});
passport.deserializeUser((id, doneCallback) => {
    user_provider.getUser(id)
        .then((user) => {
            doneCallback(null, user);
        })
        .catch((err) => {
            doneCallback(new Error("Internal Error!"));
        });
});
exports.createJWT = (user_id, role) => jwt.sign({
    sub: user_id,
    sub2: Buffer.from(role).toString('base64')
}, config.auth.secret);
exports.hasToken = passport.authenticate('jwt', { session: false });
exports.hasTokenOrNot = passport.authenticate(['jwt', 'anonymous'], { session: false });
exports.authenticateLogin = (req, res, next, cb) => {
    passport.authenticate('local', { session: false }, cb)(req, res, next);
};
