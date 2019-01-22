var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ArticleSchema   = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    title: {type: String, required: true},
    tag:{type:String,default:""},
    content: {type:String,required:true},
    draft: {type:Boolean,default:false},
},{
    timestamps: { createdAt: 'created_at',updatedAt:'updated_at' }
});
module.exports = mongoose.model('Article', ArticleSchema);