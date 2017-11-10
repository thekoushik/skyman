var User = require('../models').user;

module.exports.userCreate=(user)=>{
    /*return new Promise((res,rej)=>{
        User.findOne({ username: user.username })
            .select('enabled')
            .exec((err, doc)=>{
                if(err) rej(err);
                else{
                    if(doc) rej({
                                    message: "username exists",
                                    name: "ValidationError"
                                });
                    else{
                        User.create(user,(err2,small)=>{
                            if(err2) rej(err2);
                            else res(small);
                        });
                    }
                }
            });
    })*/
    return User.create(user);
}
module.exports.getUserByUsernameAndToken=(username,type,token)=>{
    return User.findOne({username: username,'auth_token.token_type':type,'auth_token.token':token}).exec();
}
module.exports.getUser=(id)=>{
    return User.findById(id)
            .select(User.DTOPropsFull)
            .exec();
}
module.exports.getUserByEmail=(email)=>{
    return User.findOne({email})
            .select(User.DTOPropsAuth)
            .exec();
}
module.exports.getUserByCredentials=(username,password)=>{
    return User.findOne({username,password})
            .select(User.DTOPropsFull)
            .exec();
}
module.exports.userList=(size,last)=>{
    size=(typeof size == undefined) ? 10 : Number(size);
    var query={};
    if(last) query['_id']={ $gt: last};
    return User.find(query)
        .select(User.DTOProps)
        .limit(size)
        .exec();
}