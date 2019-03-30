module.exports=require('./dist').Skyman;
module.exports.SQLDatabase=require('./dist/db/SQLDatabase').SQLDatabase;
module.exports.NoSQLDatabase=require('./dist/db/NoSQLDatabase').NoSQLDatabase;
module.exports.View=require('./dist/view').View;
module.exports.Auth=require('./dist/auth').Auth;