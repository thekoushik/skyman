import Feather from './Feather';

export class ContentNegotiator implements Feather{
    attach(settings:any,options:any,root:string,app:any){
        app.use(require('helmet')(settings.helmet));
        app.use(require('cookie-parser')());//this.settings.cookieparser
        var bodyParser = require('body-parser');
        for(let key in settings.bodyparser)
            app.use(bodyParser[key](settings.bodyparser[key]));
    }
}