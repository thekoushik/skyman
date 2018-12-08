var Article=require('../models').article;

exports.createArticle=(user_id,data)=>{
    data.user=user_id;
    return Article.create(data);
}
exports.updateArticle=(user_id, id,data)=>{
    return Article.findOneAndUpdate({_id:id,user:user_id},data).exec()
}
exports.getArticle=(user_id,id)=>{
    return Article.findOne({_id:id,user:user_id}).exec();
}
exports.getUserArticles=(user_id)=>{
    return Article.find({user:user_id}).sort('-created_at').exec();
}
exports.getArticleFromOutside=(id)=>{
    return Article.findById(id).populate('user','name').exec();
}
exports.getAllArticles=(last,limit)=>{
    if(!limit) limit=10;
    var q={};
    if(last) q['_id']={'$gt':last};
    return Article.find(q).sort('-created_at').populate('user','name').exec();
}
exports.removeArticle=(user_id,id)=>{
    return Article.findOneAndRemove({_id:id,user:user_id}).exec();
}