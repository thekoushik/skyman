import Feather from "../Feather";
import { SQLDatabase } from "./SQLDatabase";
import { NoSQLDatabase } from "./NoSQLDatabase";
declare var global:any;

export class Database implements Feather{
    attach(settings:any,options:any,root:string,app:any){
        if(options.db){
            if(settings.db.type=='sql' || settings.db.type=='both'){
                let sql=new SQLDatabase(settings.db);
                sql.connect(global.config.db.sql)
                .then(()=>{
                    //console.log("Database Connected..");
                })
                .catch((e:any)=>{
                    console.log(e)
                });
            }
            if(settings.db.type=='nosql' || settings.db.type=='both'){
                let nosql=new NoSQLDatabase(settings.db);
                nosql.connect(global.config.db.nosql)
                .then(()=>{
                    //console.log("Database Connected..");
                })
                .catch((e:any)=>{
                    if(e.name=="MongoError")
                        console.log("Cannot connect to database. Please check your database connection.");
                    else
                        console.log(e)
                });
            }
            //load models and convert to swagger
        }
    }
}