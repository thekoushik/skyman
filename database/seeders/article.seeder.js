var {user_service,article_service} = require('../services');
var faker = require('faker');

module.exports=()=>{
    return user_service.getAllUsers('_id')
    .then((ids)=>{
        if(ids.length==0) return console.log('No user found, please add user first');
        var articles=[];
        ids.forEach((id)=>{
            var count=2+Math.ceil(Math.random()*3);
            for(var i=0;i<count;i++)
                articles.push(article_service.createArticle(id,{
                    title:faker.hacker.phrase(),
                    tag: faker.hacker.adjective(),
                    content: faker.lorem.lines(2+Math.ceil(Math.random()*3))
                }));
        })
        return Promise.all(articles);
    })
}