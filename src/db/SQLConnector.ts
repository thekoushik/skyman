import DBConnector from './DBConnector';
import BasicDBConnector from './BasicDBConnector';

export default class SQLConnector extends BasicDBConnector implements DBConnector{
    constructor(){
        super();
        this.driver=require('sequelize');
        this.options={};
    }
    connect(config:any):Promise<any>{
        this.connection=new this.driver(config.uri || config);
        return this.connection.authenticate();
    }
    createModel(name:string,definition:any,option:any={}):any{
        return this.connection.define(name, definition,option);
    }
    type(name:string,args:any[]):any{
        if(args.length==0)
            return this.connection[name];
        else
            return this.connection[name].apply(null,args);
    }
    getConnection():any{
        return this.connection;
    }
}