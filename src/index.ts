let express=require('express');
import {Settings,DefaultSettings} from './common/Settings';
import { Options,DefaultOptions } from './common/Options';
import bootstrap from './bootstrap';
import {Router} from './router';
import { DB } from './db';
import { mergeDeep } from './utils';
declare var global:any;

/**
 * 
 */
export class Skyman{
    private loaded:boolean=false;
    private root:string='';
    app:any;
    private options:Options;
    private settings:Settings;
    private config:any={};
    constructor(options?:Options){
        this.app=express();
        this.options={...DefaultOptions,...(options||{})};
        this.settings={...DefaultSettings};
    }
    /**
     * Loads the settings from "system\settings.js" and the main application 
     * 
     * @param root Application directory
     */
    load(root:string="."){
        if(this.loaded) throw new Error("Application already loaded");
        this.root=root;
        this.config=require(this.root+"/config.js");
        this.settings=mergeDeep({},this.settings,require(this.root+"/system/settings.js"))
        global.config=this.config[process.env.mode || 'development'];
        for(var key in this.settings.statics)
            this.app.use(key,express.static(this.settings.statics[key]));
        bootstrap({settings:this.settings,options:this.options,root:this.root,app:this.app});
        if(this.options.db){
            DB.getInstance()
            .connect(global.config.db)
            .then(()=>{
                //console.log("Database Connected..");
            })
            .catch((e:any)=>{
                if(e.name=="MongoError")
                    console.log("Cannot connect to database. Please check your database connection.");
                else
                    console.log(e)
            });
        }
        this.loaded=true;
    }
    fly(cb?:Function){
        this.app.listen(this.options.port,cb || (()=>{
            console.log('Skyman is flying on port',this.options.port);
            for(let route in Router.routerTree){
                for(let method in Router.routerTree[route]){
                    console.log(`${method.toUpperCase()}\t${route}\t${Router.routerTree[route][method].operationId}`);
                }
            }
        }));
    }
}