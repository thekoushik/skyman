var {kernel}=require('../system');
var util=require('../utils');
var {user_service,mail_service}=require('../database').services;
var user_model=require('../database').models.user;

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
    kernel.authenticateLogin(req,res,next,(err,user,info)=>{
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
                mail_service.sendEmailConfirm(user.email,global.config.url+'/verify?token='+token)
                .then((response)=>{
                    console.info(response);
                })
                .catch((err)=>{
                    console.error(err);
                });
                req.flash('success','Please check your email for email verification link')
                res.redirect('/login');
            }else{
                res.render('error/500.html',{err:'Already verified'});
            }
        })
        .catch((err)=>{
            res.render('error/500.html',{err:'Wrong email'});
        })
}
exports.verify=(req,res)=>{
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
                req.flash('success','Verification Successful')
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
            if(user.account_expired){
                req.flash('error','Account has expired')
                res.redirect('/forgot');
            }else if(user.credential_expired){
                req.flash('error','Your credential has expired')
                res.redirect('/forgot');
            }else if(user.account_locked){
                req.flash('error','Account is locked')
                res.redirect('/forgot');
            }else if(!user.enabled){
                req.flash('error','Account is not activated')
                res.redirect('/forgot');
            }else{
                var newtoken=util.createToken();
                newtoken.token_type=user_model.PASSWORD_RESET_TOKEN;
                user.auth_token=newtoken;
                return user.save();
            }
        })
        .then((newuser)=>{
            const token=util.encodeAuthToken(newuser.username,newuser.auth_token.token);
            mail_service.sendEmailForgot(newuser.email,global.config.url+'/reset?token='+token)
            .then((response)=>{
                console.info(response);
            })
            .catch((err)=>{
                console.error(err);
            });
            req.flash('success','Please check your email for password reset link')
            res.redirect('/login');
        })
        .catch((err)=>{
            console.log(err);
            req.flash('error','Wrong email')
            res.redirect('/forgot');
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
                req.flash('success','Password reset successful')
                res.redirect('/login');
            })
            .catch((err)=>{
                res.render('error/500.html',{err:'Invalid token'});
            })
    }else
        res.render('error/500.html',{err: 'Missing token'});
}
