export class NoSQLDatabase{
    private static singleton:NoSQLDatabase;
    private static driver:any;
    protected options:any;
    private static schemaBuilder:any;
    private settings:any;
    constructor(settings?:any){
        if(NoSQLDatabase.singleton) throw new Error("Database is already initialized, use the static methods.");
        NoSQLDatabase.singleton=this;
        this.settings=settings;
        var mongoose=require('mongoose');
        mongoose.set('useCreateIndex', true);
        //mongoose.Promise=global.Promise;
        mongoose.plugin((schema:any, options:any) => {
            let indexes:any = schema.indexes();
            if (indexes.length == 0) return;
            let postHook = (error:any, _:any, next:any) => {
                if (error.name == 'MongoError' && error.code == 11000) {
                    let regex = /index: (.+) dup key:/;
                    let matches = regex.exec(error.message);
                    if (matches) {
                        let first_match = matches[1];
                        for (let i:number = 0; i < indexes.length; i++) {
                            for (let field in indexes[i][0]){
                                if (indexes[i][1].unique && (first_match.indexOf('$' + field) > 0 || first_match.startsWith(field+'_')) ){
                                    let e:any = {}
                                    e[field] = new mongoose.Error.ValidatorError({
                                        type: 'unique',
                                        path: field,
                                        message: '"' + field + '" already exist'
                                    });
                                    let beautifiedError:any = new mongoose.Error.ValidationError();
                                    beautifiedError.errors = e;
                                    return next(beautifiedError);
                                }
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
        this.options={ useNewUrlParser: true };
        NoSQLDatabase.driver=mongoose;
        NoSQLDatabase.schemaBuilder=mongoose.Schema;
    }
    connect(config:any):Promise<any>{
        return NoSQLDatabase.driver.connect(config.uri,this.options)
    }
    public static getInstance():NoSQLDatabase{
        return NoSQLDatabase.singleton;
    }
    public static createModel(name:string,definition:any,option:any={}):any{
        return NoSQLDatabase.driver.model(name,new NoSQLDatabase.schemaBuilder(definition,option));
    }
    public static type(name:string):any{
        return NoSQLDatabase.schemaBuilder.Types[name];
    }
    public static connection(){
        return NoSQLDatabase.driver;
    }
}