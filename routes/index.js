var middleware = require('../middlewares');
var controllers = require('../controllers');

const routerJson=[
    {
        path:"/",
        controller: controllers.main.index
    },{
        path:"/blog",
        controller:controllers.main.allArticlePage
    },{
        path:"/blog/:id",
        controller:controllers.main.viewArticlePage
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
        middleware: middleware.shouldLogin,
        children:require('./user')
    },{
        controller: controllers.main.errorHandler
    },{
        path: "*",
        controller: controllers.main.notFound
    }
];
module.exports=routerJson;