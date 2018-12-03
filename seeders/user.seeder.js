var {user_service}=require('../services');
var faker = require('faker');

module.exports=()=>{
    return user_service.userCreate(Array.apply(null,{length:10}).map(()=>{
        return {
            name:faker.name.findName(),
            email:faker.internet.email(),
            username:faker.internet.userName(),
            password:faker.internet.password(),
            enabled:true,
        };
    }));
}