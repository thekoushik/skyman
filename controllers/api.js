var services=require('../services');

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
  services.user_service.userCreate(req.body)
    .then((user)=>{
      res.status(201).location(req.baseUrl+req.path+"/"+user._id).end();
    })
    .catch((err)=>{
      if(typeof err == 'object')
        res.status(422).json(err);
      else
        res.status(500).send(err);
    })
};
module.exports.info=function(req, res) {
  res.status(200).json(req.user);
};