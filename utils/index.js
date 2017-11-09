var mongoose = require('mongoose');
var crypto = require('crypto');

module.exports.createId=function(str){
    return new mongoose.Types.ObjectId(str);
}
module.exports.createToken=(dayAhead=1)=>{
    var date=new Date();
    date.setDate(date.getDate()+dayAhead);
    return {
        token: crypto.randomBytes(16).toString('hex'),
        expire_at: date
    };
}
module.exports.encodeVerifyToken=(user,token)=>{
    return Buffer.from(user+':'+token, 'ascii').toString('base64');
}
module.exports.decodeVerifyToken=(token)=>{
    var data=Buffer.from(token, 'base64').toString('ascii').split(':');
    return {user:data[0],token:data[1]};
}