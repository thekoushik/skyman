export default interface DBConnector{
    connect(config:any):Promise<any>;
    createModel(name:string,definition:any,option?:any):any;
    type(name:string,args:any[]):any;
    getConnection():any;
}