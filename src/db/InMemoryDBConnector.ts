import DBConnector from './DBConnector';
import BasicDBConnector from './BasicDBConnector';

export default class InMemoryDBConnector extends BasicDBConnector implements DBConnector{
    constructor(){
        super();
    }
    connect(config:any):Promise<any>{
        console.log('Connecting in-memory database..');
        return this.driver.connect(config.uri,this.options)
    }
    createModel(name:string,definition:any,option:any={}):any{
        return null;//this.driver.model(name,new this.driver.Schema(definition,option));
    }
    type(name:string,args:any[]):any{
        return null;
    }
    getConnection():any{
        return null;
    }
}