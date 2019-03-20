import DBConnector from './DBConnector';
import InMemoryDBConnector from './InMemoryDBConnector';
import NoSQLConnector from './NoSQLConnector';
import SQLConnector from './SQLConnector';

/**
 * 
 */
export class DB{
    private static singleton:DB;
    private connector:DBConnector;
    private settings:any;
    constructor(settings?:any){
        if(DB.singleton) throw new Error("Database is already initialized, use the static methods.");
        DB.singleton=this;
        //this.connector=new InMemoryDBConnector();
        this.settings=settings;
        if(this.settings.nosql){
            this.connector=new NoSQLConnector();
        }else{
            this.connector=new SQLConnector();
        }
    }
    connect(config:any):Promise<any>{
        return this.connector.connect(config);
    }
    public static getInstance():DB{
        return DB.singleton;
    }
    static createModel(name:string,definition:any,option:any={}):any{
        return DB.singleton.connector.createModel(name,definition,option);
    }
    static type(name:string,...args:any):any{
        return DB.singleton.connector.type(name,args);
    }
    static connection(){
        return DB.singleton.connector.getConnection();
    }
}