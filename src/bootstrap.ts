import { ContentNegotiator } from "./ContentNegotiator";
import { View } from "./view";
import { Session } from "./Session";
import { Auth } from "./auth";
import { Router } from "./router";
import Feather from "./Feather";
import { DBWrapper } from "./db/wrapper";

const FeatherOrder=[
    new View(),
    new ContentNegotiator(),
    new Session(),
    new DBWrapper(),
    new Auth(),
    new Router()
]
export default function bootstrap(ctx:any){
    FeatherOrder.forEach((feather:Feather)=>{
        feather.attach(ctx.settings,ctx.options,ctx.root,ctx.app);
    })
}