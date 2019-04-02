const fs=require('fs');
const path=require('path');

export function scanFiles(folder:string):string[]{
    var scripts:string[]=[];
    try{
        fs.readdirSync(folder).forEach((file:string)=>{
            var f= path.parse(file);
            if(f.ext==".js"){
                //if(f.name!="index")
                scripts.push(f.name);
            }
        });
    }catch(e){}
    return scripts;
}
export function joinURLs(...urls:string[]):string{
    let result=urls.map(url=>{
        var u=url.trim();
        if(u.length){
            if(u=="/") return ""
            else return u.startsWith("/")?u:"/"+u;
        }else
            return "";
    }).join("");
    return result?result:"/";
}
export function isObject(item:any):boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
export function mergeDeep(target:any, ...sources:any):any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function convertToOpenAPISchema(model:any){
  return null;
}