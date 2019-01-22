var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
mongoose.plugin((schema, options)=>{
    var indexes=schema.indexes();
    if(indexes.length==0) return;
    var postHook=(error, _, next)=>{
        if(error.name=='MongoError' && error.code==11000){
            var regex=/index: (.+) dup key:/;
            var matches=regex.exec(error.message);
            if(matches){
                matches=matches[1];
                for(var i=0;i<indexes.length;i++){
                    for(var field in indexes[i][0])
                        if(indexes[i][1].unique && matches.indexOf('$'+field)>0){
                            var e={}
                            e[field]=new mongoose.Error.ValidatorError({
                                type: 'unique',
                                path: field,
                                message: field+' already exist'
                            })
                            var newError = new mongoose.Error.ValidationError();
                            newError.errors = e;
                            return next(newError);
                        }
                }
            }
        }
        next(error);
    }
    schema.post('save', postHook);
    schema.post('update', postHook);
    schema.post('findOneAndUpdate', postHook);
})
exports.connect=(noseed)=>{
    var con=mongoose.connect(config.mongoURI,{ useMongoClient: true});
    if(!noseed)
        con.then(()=>{
            require('./seeders').seed('admin');//disable this line if you don't want default admin seeding
        })
    else
        return con;
}