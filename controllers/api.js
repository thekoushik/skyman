var router = require('express').Router();
var middleware = require('../middlewares');
var User = require('../models').user;
const utils = require('../utils');

router.get('/', function(req, res) {
  res.send('Api Index');
});
router.get('/users', function(req, res) {
  const size=(typeof req.query.size == "undefined") ? 10 : Number(req.query.size);
  var query={};
  if(req.query.last) query['_id']={ $gt: utils.id(req.query.last)};
  User.find(query, utils.userDTOProps,{limit:size},function(err, docs) {
    if(err) res.status(500).end();
    else res.status(200).json(docs);
  });
});
router.get('/user/:id',function(req,res){
  User.findById(req.params.id,utils.userDTOProps,function(err,doc){
    if(err) res.status(500).end();
    else res.status(200).json(doc);
  });
});
router.post('/register',function(req,res){
  User.find({ username: req.body.username }, 'enabled', function (err, docs) {
    if(err) res.status(500).end();
    else{
      if(docs.length>0) res.status(400).end("username exists");
      else{
        User.create(req.body,function(err2,small){
          if(err2) res.status(500).json(err2);
          else res.status(200).json(small);
        });
      }
    }
  });
});
router.get('/secret', middleware.shouldLogin, function(req, res) {
  res.status(200).json(req.user);
});

module.exports = router