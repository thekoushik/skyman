var express = require('express');
var app = module.exports = express();

app.use('/static',express.static('static'));

require('nunjucks').configure('views', {
    autoescape: true,
    express: app
});

var {router} = require('./system');

app.use(router.createRouterFromJson(require('./routes')));

var port=process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("Listening on 'http://127.0.0.1:"+port);
});
