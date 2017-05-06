var mongoose = require('mongoose');

const mongoDB = 'mongodb://127.0.0.1/express-starter';
mongoose.connect(mongoDB);

module.exports.user=require('./user');