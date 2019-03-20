/**
 * 
 */
export interface Options{
    session?: boolean;
    flash?:boolean;
    auth?:boolean;
    view?:boolean;
    db?:boolean;
    port?:string|number;
}
/**
 * 
 */
export const DefaultOptions:Options={
    session:true,
    flash:true,
    auth:false,
    view:true,
    db:false,
    port:process.env.PORT || 8000
};