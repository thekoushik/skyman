/*
Usage:
    throw make404()
*/
global.make404=(msg)=>{
    var err=new Error(msg || "Page not found");
    err.code = '404';
    return err;
}
global.goBackWithData=(req,res)=>{
    req.flash('_old_',req.body);
    return res.redirect('back');
}