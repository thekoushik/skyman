module.exports.shouldLogin=function(req,res,next){
    if(req.isAuthenticated()) next();
    else res.status(404).end();
};