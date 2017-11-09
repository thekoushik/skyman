var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:  {type:String,required: true},
  email: {type:String,required: true, unique: true},
  username: {type:String,required: true,unique: true},
  password: {type:String,required: true},
  enabled: { type: Boolean, default: false },
  verify_token:{
    token: String,
    expire_at: Date
  },
  account_locked: { type: Boolean, default: false },
  account_expired: { type: Boolean, default: false },
  credential_expired: { type: Boolean, default: false },
  roles: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports=mongoose.model('user',userSchema);
module.exports.DTOProps='_id name email username created_at';
module.exports.DTOPropsFull='_id name email username enabled account_locked account_expired credential_expired roles created_at';