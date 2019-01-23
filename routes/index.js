var middleware = require('../middlewares');

const routerJson=[
    {
        path:"/",
        controller: "main.index"
    },{
        path:"/blog",
        controller:"main.allArticlePage"
    },{
        path:"/blog/:id",
        controller:"main.viewArticlePage"
    },
    ...require('./auth'),
    {
        path:"/api",
        children:require('./api')
    },{
        path: "/admin",
        middleware: middleware.hasRole("admin"),
        children:require('./admin')
    },{
        middleware: "index.shouldLogin",
        children:require('./user')
    },{
        controller: "main.errorHandler"
    },{
        path: "*",
        controller: "main.notFound"
    }
];
module.exports=routerJson;