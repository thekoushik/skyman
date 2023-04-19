var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const VERIFY_TOKEN = 'VERIFY_TOKEN';
const OTP_TOKEN = 'OTP_TOKEN';
const PASSWORD_RESET_TOKEN = 'PASSWORD_RESET_TOKEN';

const ADMIN = 'ADMIN';//admin
const USER = 'USER';//customer

//on update, cascade update in message_history
var userSchema = new Schema({
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  photo: { type: String, default: '' },
  mobile: { type: String, default: '' },
  address: { type: String, default: '' },
  location: {
    type: { type: String, enum: ['Point'], default: undefined },
    coordinates: { type: [Number], default: undefined }
  },
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  postcode: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' },
  enabled: { type: Boolean, default: false },
  token: String,
  auth_token: {
    token_type: {
      type: String,
      enum: [VERIFY_TOKEN, OTP_TOKEN, PASSWORD_RESET_TOKEN],
      default: VERIFY_TOKEN
    },
    token: String,
    expire_at: Date
  },
  role: {
    type: String,
    enum: [ADMIN, USER],
    required: true
  },
  account_locked: { type: Boolean, default: false },
  // account_expired: { type: Boolean, default: false },
  // credential_expired: { type: Boolean, default: false },
  device_tokens: [String],
  two_factor: {
    type: Boolean,
    default: false
  },
  //social_signin:
  facebook_id: { type: String },
  google_id: { type: String },
  apple_id: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
userSchema.virtual('photo_url').get(function () {//do not use arrow function here
  return getProfilePhotoURL(this, 'photo')// (this.profile && this.profile.photo)?('uploads/profile_photo/'+this.profile.photo):'assets/img/user.png';
});
userSchema.virtual('fullname').get(function () {//do not use arrow function here
  return this.firstname + ' ' + this.lastname;
});
userSchema.virtual('role_name').get(function () {//do not use arrow function here
  switch (this.role) {
    case 'ADMIN': return 'Admin';
    case 'USER': return 'Customer';
    default: '';
  }
});
userSchema.index({
  firstname: 'text',
  lastname: 'text',
});
userSchema.index({ location: "2dsphere" });

module.exports = {
  model: mongoose.model('user', userSchema),
  DTOProps: '_id firstname lastname email photo mobile address street city postcode state country account_locked enabled role created_at two_factor ',
  DTOPropsProfile: 'firstname lastname email photo mobile address street city postcode state country role two_factor',
  DTOPropsFull: '_id firstname lastname email photo mobile address street city postcode state country role enabled account_locked created_at device_tokens two_factor',
  DTOPropsAuth: '_id firstname lastname email photo mobile address street city postcode state country role enabled account_locked created_at auth_token device_tokens two_factor',
  DTOPropsInfo: '_id firstname lastname email mobile photo role created_at',
  DTOPropsMin: '_id firstname lastname email photo role created_at',
  VERIFY_TOKEN: VERIFY_TOKEN,
  PASSWORD_RESET_TOKEN: PASSWORD_RESET_TOKEN,
  OTP_TOKEN: OTP_TOKEN,
  roles: {
    ADMIN,
    USER,
  }
}