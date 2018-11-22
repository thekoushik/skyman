var createError=require('http-errors');
var csrf = require('csurf');

exports.csrfProtection = csrf({ cookie: true });
exports.shouldLogin=(req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user = req.user;
        next();
    }else res.redirect('/login?next='+req.originalUrl);// res.status(403).end();
};
exports.hasRole=(roles)=>{
    return (req,res,next)=>{
        if(!req.isAuthenticated())
            res.redirect('/login?next='+req.originalUrl);//res.status(403).end();// next(new Error("You are not allowed to access this page"));
        else{
            var has=false;
            if(Array.isArray(roles)){
                roles.forEach(function(role){
                    if(Array.isArray(req.user.roles))
                        if(req.user.roles.indexOf(role)>=0)
                            has=true;
                });
            }else if(typeof roles == "string"){
                if(Array.isArray(req.user.roles))
                    if(req.user.roles.indexOf(roles)>=0)
                        has=true;
            }
            if(!has)
                return next(createError(403, 'You are not allowed to access this page', { code: 'ENEEDROLE'}));
            next();
        }
    };
};