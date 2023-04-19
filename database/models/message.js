var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    from_user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    anonymous: {
        type: Boolean,
        default: false
    },
    to_user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    deleted_sender_at: Date,
    deleted_receiver_at: Date
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
module.exports = {
    model: mongoose.model('Message', MessageSchema)
};