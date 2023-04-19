var http = require('http');
const https = require('https');
const fs = require('fs');

exports.createServer = (expressApp, httpsConfig) => {
  if (!httpsConfig)
    return http.createServer(expressApp);
  const httpsConfig = {
    key: fs.readFileSync(httpsConfig.key, 'utf8'),
    cert: fs.readFileSync(httpsConfig.cert, 'utf8'),
  };
  if (httpsConfig.passphrase)
    httpsConfig.passphrase = httpsConfig.passphrase;
  return https.createServer(httpsConfig, expressApp);
}