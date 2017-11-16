var mongoose = require('mongoose');
var crypto = require('crypto');

exports.createId=function(str){
    return new mongoose.Types.ObjectId(str);
}
exports.createToken=(dayAhead=1)=>{
    var date=new Date();
    date.setDate(date.getDate()+dayAhead);
    return {
        token: crypto.randomBytes(16).toString('hex'),
        expire_at: date
    };
}
exports.encodeAuthToken=(user,token)=>{
    return Buffer.from(user+':'+token, 'ascii').toString('base64');
}
exports.decodeAuthToken=(token)=>{
    var data=Buffer.from(token, 'base64').toString('ascii').split(':');
    return {user:data[0],token:data[1]};
}