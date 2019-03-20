var path=require('path');
var fs=require('fs');
var util=require('../utils');
function genModel(table){
    var file=path.resolve('database','models',table+'.js')
    if(fs.existsSync(file)) return false;
    var tableName=util.snakeToCamel(table);
    var start=`var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ${tableName}Schema   = new Schema({
    name: {type: String, required: true},
},{
    timestamps: { createdAt: 'created_at',updatedAt:'updated_at' }
});
module.exports = mongoose.model('${tableName}', ${tableName}Schema);`;
    fs.writeFileSync(file,start);
    return true;
}
var cmd=process.argv[2];
if(process.argv.length<4)
    console.log(`Generator:
model:        npm run gen model      <model_name>`);
else if(cmd=="model"){
    var model=process.argv[3];
    if(!genModel(model)){
        console.log('File '+model+' already exists');
    }
}