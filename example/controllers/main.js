exports.index=(req,res)=>{
    res.render('index.html');
};
var notFound=exports.notFound=(req,res)=>{
    res.render('error/404.html',{origin:req.originalUrl});
};
exports.errorHandler=(err, req, res, next)=>{
    if (err.code === 'EBADCSRFTOKEN') res.status(403).send('Page Expired!');
    else if(err.code === 'ENEEDROLE') res.render("error/403.html");
    else if(err.code === '404') return (req.accepts(['json','html'])=='json')?res.status(404).end():notFound(req,res);
    else if(err) res.render('error/500.html',{err:err});
    else next();
};
