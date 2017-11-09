var securityManager = require('../index').securityManager;
var util=require('../utils');
var user_service=require('../services').user_service;

module.exports.index=function(req,res){
    if(req.isAuthenticated())
        res.render('dashboard',{user:req.user});
    else
        res.render('index');
};
module.exports.loginPage=function(req,res){
    if(req.isAuthenticated())
        res.redirect('/');
    else
        res.render('auth/login',{
            csrfToken:req.csrfToken(),
            nextUrl: ((req.query.next) ? "?next="+req.query.next: ""),
            loginerror:(req.query.error!=undefined),
            loginerrormsg:req.flash('loginerrormsg')
        });
};
module.exports.registerPage=function(req,res){
    res.render('auth/join',{});
};
module.exports.login=function(req,res,next){
    securityManager.authenticateLogin(req,res,next,function(err,user,info){
        if (err) return next(err);
        req.flash('loginerrormsg', (info)?info.message:"");
        if (!user) return res.redirect('/login?error=1'+((req.query.next)?"&next="+req.query.next:""));
        // Manually establish the session...
        req.login(user, function(err) {
            if (err) return next(err);
            if(req.query.next) return res.redirect(req.query.next);
            return res.redirect('/');
        });
    });
};
module.exports.logout=function(req,res){
    req.logout();
    res.redirect('/');
};
module.exports.resend_verify_page=(req,res)=>{
    res.render('auth/resend');
}
module.exports.resend_verify=(req,res)=>{
    user_service.getUserByEmail(req.body.email)
        .then((user)=>{
            if(!user.enabled){
                const token=util.encodeVerifyToken(user.username,user.verify_token.token);
                securityManager
                    .sendEmailConfirm('thekoushik.universe@gmail.com','http://localhost:8000/verify?token='+token)
                    .then((response)=>{
                        console.info(response);
                    })
                    .catch((err)=>{
                        console.error(err);
                    });
            }else{
                console.log('Already verified');
            }
            res.redirect('/login');
        })
        .catch((err)=>{
            res.render('error/500',{err:'Wrong email'});
        })
}
module.exports.verify=function(req,res){
    if(req.query.token){
        var {user,token} = util.decodeVerifyToken(req.query.token);
        user_service.getUserByUsernameAndToken(user,token)
            .then((_user)=>{
                if(Date.now()>_user.verify_token.expire_at)
                    res.render('error/500',{err:'Token expired'});
                else{
                    _user.verify_token=null;
                    _user.enabled=true;
                    return _user.save();
                }
            })
            .then((_user)=>{
                res.redirect('/login');
            })
            .catch((err)=>{
                res.render('error/500',{err:'Invalid token'});
            })
    }else
        res.render('error/500',{err: 'Missing token'});
};
module.exports.notFound=function(req,res){
    res.render('error/404',{origin:req.originalUrl});
};
module.exports.errorHandler=function (err, req, res, next) {
  if (err.code === 'EBADCSRFTOKEN') res.status(403).send('Hack Attempt!');
  else if(err.code === 'ENEEDROLE') res.render("error/403");
  else return next(err);
};