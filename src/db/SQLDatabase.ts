export class SQLDatabase{
    private static singleton:SQLDatabase;
    protected driver:any;
    protected options:any;
    protected connection:any;
    private settings:any;
    constructor(settings?:any){
        if(SQLDatabase.singleton) throw new Error("Database is already initialized, use the static methods.");
        SQLDatabase.singleton=this;
        this.settings=settings;
        this.driver=require('sequelize');
        this.options={};
    }
    connect(config:any):Promise<any>{
        this.connection=new this.driver(config.uri || config);
        return this.connection.authenticate();
    }
    public static getInstance():SQLDatabase{
        return SQLDatabase.singleton;
    }
    public static createModel(name:string,definition:any,option:any={}):any{
        return SQLDatabase.singleton.connection.define(name, definition,option);
    }
    public static type(name:string,...args:any):any{
        if(args.length==0)
            return SQLDatabase.singleton.connection[name];
        else
            return SQLDatabase.singleton.connection[name].apply(null,args);
    }
    public static connection(){
        return SQLDatabase.singleton.connection;
    }
}