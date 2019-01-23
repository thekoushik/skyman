var assert = require('assert');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();
const config=global.config = require('../../config').test;
var {connect} = require('../../database');
var {user_provider}=require('../../database').providers;
var utils=require('../../utils');

before(function (done) {
  connect(true).then((_)=>{
    done();
  });
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
      return user_provider.getUser("abcdef0123456789abcdef01").should.become(null);
    });
  });
});