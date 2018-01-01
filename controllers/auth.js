var securityManager = require('../index').securityManager;
var util=require('../utils');
var user_service=require('../services').user_service;
var user_model=require('../models').user;
var config = require('../config');

exports.loginPage=(req,res)=>{
    if(req.isAuthenticated())
        res.redirect('/');
    else
        res.render('auth/login.html',{
            csrfToken:req.csrfToken(),
            nextUrl: ((req.query.next) ? "?next="+req.query.next: ""),
            loginerror:(req.query.error!=undefined)
        });
};
exports.registerPage=(req,res)=>{
    res.render('auth/join.html',{});
};
exports.login=(req,res,next)=>{
    securityManager.authenticateLogin(req,res,next,(err,user,info)=>{
        if (err) return next(err);
        if (!user){
            if(info.message)
                req.flash('warning', info.message);
            return res.redirect('/login?error=1'+((req.query.next)?"&next="+req.query.next:""));
        }else
            req.flash('info', "Welcome "+user.name);
        // Manually establish the session...
        req.login(user, (err)=>{
            if (err) return next(err);
            if(req.query.next) return res.redirect(req.query.next);
            return res.redirect('/');
        });
    });
};
exports.logout=(req,res)=>{
    req.logout();
    res.redirect('/');
};
exports.resend_verify_page=(req,res)=>{
    res.render('auth/resend.html');
}
exports.resend_verify=(req,res)=>{
    user_service.getUserByEmail(req.body.email)
        .then((user)=>{
            if(!user.enabled){
                const token=util.encodeAuthToken(user.username,user.auth_token.token);
                securityManager
                    .sendEmailConfirm(user.email,config.url+'/verify?token='+token)
                    .then((response)=>{
                        console.info(response);
                    })
                    .catch((err)=>{
                        console.error(err);
                    });
                res.redirect('/login');
            }else{
                res.render('error/500.html',{err:'Already verified'});
            }
        })
        .catch((err)=>{
            res.render('error/500.html',{err:'Wrong email'});
        })
}
exports.verify=function(req,res){
    if(req.query.token){
        var {user,token} = util.decodeAuthToken(req.query.token);
        user_service.getUserByUsernameAndToken(user,user_model.VERIFY_TOKEN,token)
            .then((_user)=>{
                if(Date.now()>_user.auth_token.expire_at)
                    res.render('error/500.html',{err:'Token expired'});
                else{
                    _user.auth_token.token=null;
                    _user.enabled=true;
                    return _user.save();
                }
            })
            .then((_user)=>{
                res.redirect('/login');
            })
            .catch((err)=>{
                console.log(err);
                res.render('error/500.html',{err:'Invalid token'});
            })
    }else
        res.render('error/500.html',{err: 'Missing token'});
};
exports.forgot_page=(req,res)=>{
    res.render('auth/forgot.html');
}
exports.forgot=(req,res)=>{
    user_service.getUserByEmail(req.body.email)
        .then((user)=>{
            if(user.account_expired)
                res.render('error/500.html',{err:'Account has expired'});
            else if(user.credential_expired)
                res.render('error/500.html',{err:'Your credential has expired'});
            else if(user.account_locked)
                res.render('error/500.html',{err:'Account is locked'});
            else if(!user.enabled)
                res.render('error/500.html',{err:'Account is not activated'});
            else{
                var newtoken=util.createToken();
                newtoken.token_type=user_model.PASSWORD_RESET_TOKEN;
                user.auth_token=newtoken;
                return user.save();
            }
        })
        .then((newuser)=>{
            const token=util.encodeAuthToken(newuser.username,newuser.auth_token.token);
            securityManager
                .sendEmailForgot(newuser.email,config.url+'/reset?token='+token)
                .then((response)=>{
                    console.info(response);
                })
                .catch((err)=>{
                    console.error(err);
                });
            res.redirect('/login');
        })
        .catch((err)=>{
            console.log(err);
            res.render('error/500.html',{err:'Wrong email'});
        })
}
exports.reset_page=(req,res)=>{
    if(req.query.token){
        var {user,token} = util.decodeAuthToken(req.query.token);
        user_service.getUserByUsernameAndToken(user,user_model.PASSWORD_RESET_TOKEN,token)
            .then((_user)=>{
                if(Date.now()>_user.auth_token.expire_at)
                    res.render('error/500.html',{err:'Token expired'});
                else{
                    res.render('auth/reset.html',{token:req.query.token});
                }
            })
            .catch((err)=>{
                res.render('error/500.html',{err:'Invalid token'});
            })
    }else
        res.render('error/500.html',{err: 'Missing token'});
}
exports.reset=(req,res)=>{
    if(req.query.token){
        var {user,token} = util.decodeAuthToken(req.query.token);
        user_service.getUserByUsernameAndToken(user,user_model.PASSWORD_RESET_TOKEN,token)
            .then((_user)=>{
                if(Date.now()>_user.auth_token.expire_at)
                    res.render('error/500.html',{err:'Token expired'});
                else{
                    _user.auth_token.token=null;
                    _user.password=req.body.password;
                    return _user.save();
                }
            })
            .then((newuser)=>{
                res.redirect('/login');
            })
            .catch((err)=>{
                res.render('error/500.html',{err:'Invalid token'});
            })
    }else
        res.render('error/500.html',{err: 'Missing token'});
}
