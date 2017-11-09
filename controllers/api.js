var securityManager=require('../index').securityManager;
var services=require('../services');
var util=require('../utils');

module.exports.userList=function(req, res) {
  services.user_service.userList(req.query.size,req.query.last)
    .then((list)=>{
      res.json(list)
    })
    .catch((err)=>{
      res.status(500).send(err);
    })
};
module.exports.user=function(req,res){
  services.user_service.getUser(req.params.id)
    .then((user)=>{
      res.status(200).json(user)
    })
    .catch((err)=>{
      res.status(500).send(err)
    })
};
module.exports.userCreate=function(req,res){
  var userdata=req.body;
  var verifyToken=util.createToken();
  userdata.verify_token=verifyToken;
  const token=util.encodeVerifyToken(userdata.username,verifyToken.token);
  services.user_service.userCreate(userdata)
    .then((user)=>{
      securityManager
        .sendEmailConfirm('thekoushik.universe@gmail.com','http://localhost:8000/verify?token='+token)
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
        if(err.code==11000){
          res.status(422).json({message:'Uniqueness violation'});
        }else
          res.status(422).json(err);
      }else
        res.status(500).send(err);
    })
};
module.exports.info=function(req, res) {
  res.status(200).json(req.user);
};