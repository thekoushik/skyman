"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import AuthProvider from './AuthProvider';
var LocalStrategy = require('passport-local').Strategy;
exports.default = (function (passport, settings) {
    passport.use(new LocalStrategy(settings.fields, function (username, password, doneCallback) {
        //doneCallback(null,user)//success
        //doneCallback(null,null)//bad or username missing
        //doneCallback(new Error("Internal Error!"))//internal error
        settings.provider.getUserByCredentials(username, password)
            .then(function (user) {
            if (!user)
                doneCallback(null, false, { message: 'Wrong credential' });
            /*else if(user.account_expired)
                doneCallback(null,false,{message:'Account has expired'});
            else if(user.credential_expired)
                doneCallback(null,false,{message:'Your credential has expired'});
            else if(!user.enabled)
                doneCallback(null,false,{message:'Account is not activated'});
            else if(user.account_locked)
                doneCallback(null,false,{message:'Account is locked'});*/
            else
                doneCallback(null, user);
        })
            .catch(function (err) {
            doneCallback(err);
        });
    }));
    passport.serializeUser(function (user, doneCallback) {
        doneCallback(null, settings.provider.getUserID(user)); //._id
    });
    passport.deserializeUser(function (id, doneCallback) {
        settings.provider.getUserById(id)
            .then(function (user) {
            doneCallback(null, user);
        })
            .catch(function (err) {
            doneCallback(new Error("Internal Error!"));
        });
    });
});
