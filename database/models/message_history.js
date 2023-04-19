var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MessageHistorySchema   = new Schema({
    user1: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    user2: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    user_info1:{
        firstname: String,
        lastname: String,
        email: String,
        role: String,
        company: String,
        contact: String,
    },
    user_info2:{
        firstname: String,
        lastname: String,
        email: String,
        role: String,
        company: String,
        contact: String,
    },
    direction: String,//value should be {id}-{id}
    unread:{//this is a count of how many messages the other user haven't read yet
        type: Number,
        default: 0
    },
    last_message_content: String,
    last_message_date: Date,
    user: Schema.Types.Mixed,
},{
    timestamps: { createdAt: 'created_at',updatedAt:'updated_at' },
    toJSON: { virtuals: true }
});
module.exports = {
    model: mongoose.model('MessageHistory', MessageHistorySchema)
};