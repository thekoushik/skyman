var app = require('../index');

app.get('/',function(req,res){
    if(req.isAuthenticated())
        res.render('dashboard',{user:req.user});
    else
        res.render('index');
});
app.get('/login',app.securityManager.csrfProtection,function(req,res){
    if(req.isAuthenticated())
        res.redirect('/');
    else
        res.render('login',{csrfToken:req.csrfToken(),loginerror:(req.query.error!=undefined),loginerrormsg:req.flash('loginerrormsg')});
});
app.get('/join',function(req,res){
    res.render('join',{});
});
app.post('/login',app.securityManager.csrfProtection,function(req,res,next){
    app.securityManager.authenticateLogin(req,res,next,function(err,user,info){
        if (err) return next(err);
        req.flash('loginerrormsg', (info)?info.message:"");
        if (!user) return res.redirect('/login?error');
        // Manually establish the session...
        req.login(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
});
app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});

app.use('/api',require('./api'));

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403).send('Hack Attempt!');
})

app.get('*', function(req, res){
  res.render('404');
});