var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();
var config=require('../../config').test;
var {user_service}=require('../../services');
var utils=require('../../utils');

before(function (done) {
  var mongoose=require('mongoose');
  mongoose.Promise=global.Promise;
  mongoose.connect(config.mongoURI,{ useMongoClient: true},done)
});

describe('Express-Starter Test', function() {
  describe('#utils module', function() {
    it('#utils.isValidId "232323" should be false', function() {
      return assert.equal(utils.isValidId('2323'),false);
    });
    it('#utils.isValidId "abcdef0123456789abcdef01" should be true', function() {
      return assert.equal(utils.isValidId('abcdef0123456789abcdef01'),true);
    });
  });
  describe('#user module ', function() {
    it('#getuser "abcdef0123456789abcdef01" should become null', function() {
      return user_service.getUser("abcdef0123456789abcdef01").should.become(null);
    });
  });
});