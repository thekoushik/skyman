var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  {type:String,required: true},
  email: {type:String,required: true},
  username: {type:String,required: true},
  password: {type:String,required: true},
  dateCreated: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true },
  accountNonLocked: { type: Boolean, default: true },
  accountNonExpired: { type: Boolean, default: true },
  credentialsNonExpired: { type: Boolean, default: true }
});

module.exports=mongoose.model('user',userSchema);