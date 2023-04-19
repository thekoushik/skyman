const { Schema, model } = require('mongoose');

const ActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    action: String,
    module: String,
    module_id: Schema.Types.ObjectId,
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
});
module.exports = {
    model: model('Activity', ActivitySchema)
};