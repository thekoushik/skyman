var {user_provider}=require('../database').providers;

exports.dashboard=(req,res)=>{
    user_provider.getAllUsers().then((list)=>{
        res.render('admin/dashboard.html',{users:list});
    })
    .catch((e)=>{
        res.render('error/500.html');
    })
}