var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AttachmentSchema=new Schema({
    filename: String,
    file: String
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
AttachmentSchema.virtual('file_url').get(function(){//do not use arrow function here
    return getProfilePhotoURL(this,'file','email')// from helper
});
var EmailTemplateSchema   = new Schema({
    name: {type: String, required: true},
    content: {type: String, required: true},
    subject: String,
    attachments:[AttachmentSchema]
},{
    timestamps: { createdAt: 'created_at',updatedAt:'updated_at' },
    toJSON: { virtuals: true }
});
module.exports = {
    model: mongoose.model('EmailTemplate', EmailTemplateSchema)
};