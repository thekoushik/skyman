const express = require('express');
const env = require('./env');
const config = global.config = require('./config')[env.mode || 'development'];
const { createServer } = require('./utils/server');

const app = express();

const httpServer = createServer(app);
const httpsServer = config.https ? createServer(app, config.https) : null;

module.exports = app;

app.use('/assets', express.static('static'));
app.use('/uploads', express.static('uploads'));

require('nunjucks').configure('views', {
    autoescape: true,
    express: app
});

global.appRoot = __dirname;
var { router } = require('./system');

app.use(router.createRouterFromJson(require('./routes')));

var port = config.port.http;
global.appPort = port;
module.exports.httpServer = httpServer.listen(port, () => {
    console.log("Listening on 'http://127.0.0.1:" + port);
});
module.exports.httpsServer = httpsServer ? httpsServer.listen(config.port.https, () => {
    console.log('HTTPS Server running on port ' + config.port.https);
}) : null;
require('./system/chat');