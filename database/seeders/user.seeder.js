var {user_provider}=require('../providers');
var faker = require('faker');

module.exports=()=>{
    return user_provider.userCreate(Array.apply(null,{length:10}).map(()=>{
        return {
            name:faker.name.findName(),
            email:faker.internet.email(),
            username:faker.internet.userName(),
            password:faker.internet.password(),
            enabled:true,
        };
    }));
}