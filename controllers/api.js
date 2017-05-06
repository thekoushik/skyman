var router = require('express').Router();
var middleware = require('../middlewares');
var User = require('../models').user;
const utils = require('../utils');

router.get('/', function(req, res) {
  res.send('Api Index');
});
router.get('/users', function(req, res) {
  User.find({ }, utils.userDTOProps, function (err, docs) {
    if(err) res.status(500).end();
    else res.status(200).json(docs);
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
  res.send('Secret for '+req.user.name);
});

module.exports = router