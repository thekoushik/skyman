import { DB } from ".";
import Feather from "../Feather";

export class DBWrapper implements Feather{
    attach(settings:any,options:any,root:string,app:any){
        new DB(settings.db);
    }
}