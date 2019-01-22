var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const VERIFY_TOKEN = 'VERIFY_TOKEN';
const PASSWORD_RESET_TOKEN = 'PASSWORD_RESET_TOKEN';

var userSchema = new Schema({
  name:  {type:String,required: true},
  email: {type:String,required: true, unique: true},
  username: {type:String,required: true,unique: true},
  password: {type:String,required: true},
  enabled: { type: Boolean, default: false },
  auth_token:{
    token_type: {
      type: String,
      enum: [VERIFY_TOKEN,PASSWORD_RESET_TOKEN],
      default: VERIFY_TOKEN
    },
    token: String,
    expire_at: Date
  },
  account_locked: { type: Boolean, default: false },
  account_expired: { type: Boolean, default: false },
  credential_expired: { type: Boolean, default: false },
  roles: [String],
},{
  timestamps: { createdAt: 'created_at',updatedAt:'updated_at' }
});

module.exports=mongoose.model('user',userSchema);
module.exports.DTOProps='_id name email username created_at';
module.exports.DTOPropsFull='_id name email username enabled account_locked account_expired credential_expired roles created_at';
module.exports.DTOPropsAuth='_id name email username enabled account_locked account_expired credential_expired roles created_at auth_token';
module.exports.VERIFY_TOKEN=VERIFY_TOKEN;
module.exports.PASSWORD_RESET_TOKEN=PASSWORD_RESET_TOKEN;