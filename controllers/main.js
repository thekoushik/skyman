var {user_provider,article_provider} = require('../database').providers;
var util=require('../utils');
var gateman=require('gateman');
var userFormValidate=gateman({
    title:"required",
    content:"minlength:10"
});
var userProfileValidate=gateman({name:"minlength:5"});

exports.index=(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect(req.user.roles.indexOf("admin")>=0?'/admin/dashboard':'/dashboard');
    }else
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
exports.dashboard=(req,res)=>{
    res.render('user/dashboard.html')
}
exports.profile=(req,res)=>{
    res.render('user/profile.html');
}
exports.save_profile=(req,res,next)=>{
    var err=userProfileValidate({name:req.body.name},{flatten:true});
    if(err){
        for(var key in err)
            req.flash('error', key+": "+err[key]);
        return goBackWithData(req,res);
    }
    user_provider.updateUser(req.user._id,{name: req.body.name})
    .then((user)=>{
        req.flash('success','Profile updated.');
        req.login(user, (err)=>{
            if (err) return next(err);
            return res.redirect('/profile');
        });
    })
}
exports.allArticlePage=(req,res,next)=>{
    article_provider.getAllArticles(req.query.last)
    .then((list)=>{
        var data={
            list:list
        };
        if(list.length>0)
            data.nexturl="/blog?last="+list[list.length-1]._id
        res.render('articles.html',data);
    })
    .catch((e)=>next(e));
}
exports.viewArticlePage=(req,res,next)=>{
    article_provider.getArticleFromOutside(req.params.id)
    .then((a)=>{
        res.render('article.html',{data:a});
    })
    .catch((e)=>next(e));
}
exports.createArticle=(req,res,next)=>{
    var data=req.body;
    var err=userFormValidate(data,{flatten:true});
    if(err){
        for(var key in err)
            req.flash('error', key+": "+err[key]);
        return goBackWithData(req,res);
    }
    article_provider.createArticle(req.user._id,data)
    .then((d)=>{
        req.flash('success', "Article created");
        res.redirect('/articles');
    })
    .catch((e)=>next(e));
}
exports.newArticlePage=(req,res,next)=>{
    res.render('user/article/new.html');
}
exports.articleListPage=(req,res,next)=>{
    article_provider.getUserArticles(req.user._id)
    .then((list)=>{
        res.render('user/article/list.html',{list:list});
    })
    .catch((e)=>next(e));
}
exports.articleEditPage=(req,res,next)=>{
    article_provider.getArticle(req.user._id,req.params.id)
    .then((a)=>{
        res.render('user/article/edit.html',{data:a});
    })
    .catch((e)=>next(util.isDataNotFound(e)?null:e));
}
exports.editArticle=(req,res,next)=>{
    var data=req.body;
    var err=userFormValidate(data,{flatten:true});
    if(err){
        for(var key in err)
            req.flash('error', key+": "+err[key]);
        return goBackWithData(req,res);
    }
    article_provider.updateArticle(req.user._id, req.params.id,data)
    .then((a)=>{
        req.flash('success',"Article updated");
        res.redirect('/articles');
    })
    .catch((e)=>next(util.isDataNotFound(e)?null:e));
}
exports.deleteArticle=(req,res,next)=>{
    article_provider.removeArticle(req.user._id,req.params.id)
    .then((_)=>{
        req.flash('success','Article removed');
        res.redirect('/articles');
    })
    .catch((e)=>next(util.isDataNotFound(e)?null:e));
}