var app = require('../index');

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
        res.render('login',{
            csrfToken:req.csrfToken(),
            nextUrl: ((req.query.next) ? "?next="+req.query.next: ""),
            loginerror:(req.query.error!=undefined),
            loginerrormsg:req.flash('loginerrormsg')
        });
};
module.exports.registerPage=function(req,res){
    res.render('join',{});
};
module.exports.login=function(req,res,next){
    app.securityManager.authenticateLogin(req,res,next,function(err,user,info){
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
module.exports.notFound=function(req,res){
    res.render('404',{origin:req.originalUrl});
};
module.exports.errorHandler=function (err, req, res, next) {
  if (err.code === 'EBADCSRFTOKEN') res.status(403).send('Hack Attempt!');
  else if(err.code === 'ENEEDROLE') res.render("403");
  else return next(err);
};