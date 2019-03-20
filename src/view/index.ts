import Feather from '../Feather';

export class View implements Feather {
    private static singleton:View;
    private driver:any;
    private settings:any={};
    constructor(){
        View.singleton=this;
    }
    attach(settings:any,options:any,root:string,app:any){
        this.settings=settings;
        this.driver=require('nunjucks');
        this.driver.configure("views",{...this.settings.view,express:app});
    }
    static render(view_path:string,context?:any):Promise<any>{
        let view=view_path;
        if(!view.endsWith('.html')) view+='.html';
        return new Promise((resolve,reject)=>{
            View.singleton.driver.render(view,context,(err:any,str:string)=>{
                if(err) reject(err);
                else resolve(str);
            })
        })
    }
}