var {user_provider}=require('../providers');

module.exports=()=>{
    user_provider.count().then((count)=>{
        if(count==0)
            return user_provider.userCreate({
                name:"ADMINISTRATOR",
                email:"admin@mail.com",
                username:"admin",
                password:"1234",
                enabled:true,
                roles:['admin']
            })
    }).catch((e)=>{
        console.log('Error Seeding Admin',e);
    })
}