var middleware = require('../middlewares');

const routerJson = [
    {
        path: "/",
        controller: "main.index"
    },
    ...require('./auth'),
    {
        path: "/api",
        children: require('./api')
    }, {
        path: "/admin",
        middleware: middleware.hasRole("admin"),
        children: require('./admin')
    }, {
        middleware: "index.shouldLogin",
        children: require('./user')
    }, {
        controller: "main.errorHandler"
    }, {
        path: "*",
        controller: "main.notFound"
    }
];
module.exports = routerJson;