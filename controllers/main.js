var user_service = require('../services').user_service;

module.exports.index=(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect(req.user.roles.indexOf("admin")>=0?'/admin':'/dashboard');
    }else
        res.render('index');
};
module.exports.notFound=(req,res)=>{
    res.render('error/404',{origin:req.originalUrl});
};
module.exports.errorHandler=(err, req, res, next)=>{
  if (err.code === 'EBADCSRFTOKEN') res.status(403).send('Hack Attempt!');
  else if(err.code === 'ENEEDROLE') res.render("error/403");
  else return next(err);
};
module.exports.dashboard=(req,res)=>{
    res.render('user/dashboard')
}
module.exports.profile=(req,res)=>{
    res.render('user/profile');
}
module.exports.save_profile=(req,res,next)=>{
    user_service.updateUser(req.user._id,{name: req.body.name})
        .then((user)=>{
            req.login(user, (err)=>{
                if (err) return next(err);
                return res.redirect('/profile');
            });
        })
}