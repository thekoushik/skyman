const redis=require('redis');
var pub=null;
var sub=null;
var callbacks={};

if(global.config.redis){
    let database_name=global.config.redis.reminder_db;
    pub=redis.createClient({db: database_name});
    pub.send_command('config', ['set','notify-keyspace-events','Ex'], (err,channel)=>{
        if(err){
            console.log(err);
            return;
        }
        sub = redis.createClient({db: database_name})
        const expired_subKey = '__keyevent@'+database_name+'__:expired'
        sub.subscribe(expired_subKey,()=>{
            console.log('[i] Subscribed to "'+expired_subKey+'" event channel : '+channel)
            sub.on('message',(chan,msg)=>{
                //console.log('[expired]',msg)
                if(msg.startsWith('reminder:')){
                    let key=msg.substr(9);
                    //pub.get(msg.substr(9),(error,key)=>{
                    //    if(key){
                            let [type,id]=key.split('>',2);
                            try{
                                if(callbacks[type]){
                                    let result=callbacks[type](id);
                                    if(result instanceof Promise){
                                        result.then(_=>{}).catch(e=>{})
                                    }
                                }
                            }catch(e){}
                            pub.del(key);
                        //}
                    //})
                }
            })
        })
    })
}

exports.register_callback=(type,cb)=>{
    callbacks[type]=cb;
}
exports.set_reminder=(type,id,timestamp)=>{
    let unix_timestamp=0;
    if(typeof timestamp=='number'){//millisecond
        unix_timestamp=Math.round(timestamp/1000);//to seconds
    }else if(timestamp instanceof Date){
        unix_timestamp=Math.round(timestamp.getTime()/1000)//seconds
    }else
        throw new Error('timestamp required');
    if(pub){
        let key=type+'>'+id;
        try{
            pub.multi().set("reminder:"+key,'1').expireat("reminder:"+key,unix_timestamp).exec();
        }catch(e){}
    }
}
exports.remove_reminder=(type,id)=>{
    if(pub){
        try{
        pub.del('reminder:'+type+'>'+id);
        }catch(e){}
    }
}
exports.has_reminder=(type,id)=>{
    if(pub){
        return new Promise((res,rej)=>{
            try{
                pub.get('reminder:'+type+'>'+id,(error,key)=>{
                    if(error) rej(error);
                    else if(key) res(true);
                    else res(false);
                });
            }catch(e){ rej(e) }
        })
    }else{
        return Promise.resolve(false);
    }
}