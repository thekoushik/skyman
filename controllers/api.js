var securityManager=require('../index').securityManager;
var services=require('../services');
var util=require('../utils');
var config = require('../config');

exports.userList=(req, res)=>{
  services.user_service.userList(req.query.size,req.query.last)
    .then((list)=>{
      res.json(list)
    })
    .catch((err)=>{
      res.status(500).send(err);
    })
};
exports.user=(req,res)=>{
  services.user_service.getUser(req.params.id)
    .then((user)=>{
      res.status(200).json(user)
    })
    .catch((err)=>{
      res.status(500).send(err)
    })
};
exports.userCreate=(req,res)=>{
  var userdata=req.body;
  var verifyToken=util.createToken();
  userdata.auth_token=verifyToken;
  const token=util.encodeAuthToken(userdata.username,verifyToken.token);
  services.user_service.userCreate(userdata)
    .then((user)=>{
      securityManager
        .sendEmailConfirm(user.email,config.url+'/verify?token='+token)
        .then((response)=>{
            console.info(response);
        })
        .catch((err)=>{
            console.error(err);
        });
      res.status(201).location(req.baseUrl+req.path+"/"+user._id).end();
    })
    .catch((err)=>{
      if(typeof err == 'object'){
        console.log(err.toJSON());
        if(err.code==11000){
          res.status(422).json({message:'Uniqueness violation'});
        }else
          res.status(422).json(err);
      }else
        res.status(500).send(err);
    })
};
exports.info=(req, res)=>{
  res.status(200).json(req.user);
};