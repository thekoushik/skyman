import DBConnector from './DBConnector';
import BasicDBConnector from './BasicDBConnector';

export default class NoSQLConnector extends BasicDBConnector implements DBConnector{
    constructor(){
        super();
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
        this.driver=mongoose;
    }
    connect(config:any):Promise<any>{
        return this.driver.connect(config.uri,this.options)
    }
    createModel(name:string,definition:any,option:any={}):any{
        return this.driver.model(name,new this.driver.Schema(definition,option));
    }
    type(name:string,args?:any[]):any{
        return this.driver.Schema.Types[name];
    }
    getConnection():any{
        return this.driver;
    }
}