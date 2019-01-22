var {user_service,mail_service}=require('../database').services;
var util=require('../utils');

exports.userList=(req, res)=>{
  user_service.userList(req.query.size,req.query.last)
    .then((list)=>{
      res.json(list)
    })
    .catch((err)=>{
      res.status(500).send(err);
    })
};
exports.user=(req,res)=>{
  user_service.getUser(req.params.id)
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
  user_service.userCreate(userdata)
    .then((user)=>{
      mail_service.sendEmailConfirm(user.email,global.config.url+'/verify?token='+token)
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