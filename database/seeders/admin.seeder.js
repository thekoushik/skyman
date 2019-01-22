var {user_service}=require('../services');

module.exports=()=>{
    user_service.count().then((count)=>{
        if(count==0)
            return user_service.userCreate({
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