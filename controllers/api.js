var router = require('express').Router();

router.get('/', function(req, res) {
  res.send('Api Index');
});

router.get('/users', function(req, res) {
  res.send('Abc, Def, Ghi');
});
router.get('/secret', function(req, res) {
  if(req.isAuthenticated())
  res.send('Secret for '+req.user.name);
  else
  res.send('404');
});

module.exports = router