var {user_provider,article_provider} = require('../providers');
var faker = require('faker');

module.exports=()=>{
    return user_provider.getAllUsers('_id')
    .then((ids)=>{
        if(ids.length==0) return console.log('No user found, please add user first');
        var articles=[];
        ids.forEach((id)=>{
            var count=2+Math.ceil(Math.random()*3);
            for(var i=0;i<count;i++)
                articles.push(article_provider.createArticle(id,{
                    title:faker.hacker.phrase(),
                    tag: faker.hacker.adjective(),
                    content: faker.lorem.lines(2+Math.ceil(Math.random()*3))
                }));
        })
        return Promise.all(articles);
    })
}