var mongoose = require('mongoose');
var crypto = require('crypto');
exports.view=require('./view');

exports.createId=(str)=>{
    return new mongoose.Types.ObjectId(str);
}
var dateAhead=exports.dateAhead=(dayAhead=1)=>{
    var date=new Date();
    date.setDate(date.getDate()+dayAhead);
    return date;
}
exports.createToken=(dayAhead=1)=>{
    return {
        token: crypto.randomBytes(16).toString('hex'),
        expire_at: dateAhead(dayAhead)
    };
}
exports.encodeAuthToken=(user,token)=>{
    return Buffer.from(user+':'+token, 'ascii').toString('base64');
}
exports.decodeAuthToken=(token)=>{
    var data=Buffer.from(token, 'base64').toString('ascii').split(':');
    return {user:data[0],token:data[1]};
}
exports.snakeToCamel=(s)=>{
    var ss=s.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();});
    return ss[0].toUpperCase()+ss.substr(1);
}