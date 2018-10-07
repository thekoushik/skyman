var express = require('express');
var app = module.exports = express();

app.use('/static',express.static('static'));

require('nunjucks').configure('views', {
    autoescape: true,
    express: app
});

module.exports.manager = require('./boot');

app.use(require('./routes'));

var port=process.env.PORT || 8000;
app.listen(port,()=>{
    console.log("Listening on 'http://127.0.0.1:"+port);
});
