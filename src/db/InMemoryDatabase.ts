/**
 * 
 */
export class InMemoryDatabase{
    private static singleton:InMemoryDatabase;
    private settings:any;
    constructor(settings?:any){
        if(InMemoryDatabase.singleton) throw new Error("Database is already initialized, use the static methods.");
        InMemoryDatabase.singleton=this;
        this.settings=settings;
    }
    connect(config:any):Promise<any>{
        return Promise.resolve(true);
    }
    public static getInstance():InMemoryDatabase{
        return InMemoryDatabase.singleton;
    }
    static createModel(name:string,definition:any,option:any={}):any{
        return true;
    }
    static type(name:string,...args:any):any{
        return true;
    }
    static connection(){
        return true;
    }
}