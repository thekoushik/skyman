var app = require('../index');
//var express = require('express');
var middleware = require('../middlewares');
var controllers = require('../controllers');
/*
var apiRouter = express.Router();
apiRouter.get('/users',controllers.api.userList);
apiRouter.get('/user/:id',middleware.hasRole("admin"),controllers.api.user);
apiRouter.post('/register',controllers.api.userCreate);
apiRouter.get('/profile', middleware.shouldLogin, controllers.api.info);
apiRouter.use(controllers.main.errorHandler);

app.use('/api',apiRouter);

var mainRouter = express.Router();
mainRouter.get('/',controllers.main.index);
mainRouter.get('/login',app.securityManager.csrfProtection, controllers.main.loginPage);
mainRouter.post('/login',app.securityManager.csrfProtection, controllers.main.login);
mainRouter.get('/join',controllers.main.registerPage);
mainRouter.get('/logout',controllers.main.logout);
mainRouter.use(controllers.main.errorHandler);
mainRouter.get('*', controllers.main.notFound);

app.use(mainRouter);
*/
const routerJson=[
    {
        path:"/api",
        children:[
            {
                path:"/users",
                controller: controllers.api.userList
            },{
                path:"/users/:id",
                controller: controllers.api.user,
                middleware:[ middleware.hasRole("admin") ]
            },{
                path:"/users",
                method:"post",
                controller: controllers.api.userCreate
            },{
                path:"/profile",
                controller: controllers.api.info,
                middleware:[ middleware.shouldLogin ]
            },{
                controller: controllers.main.errorHandler
            }
        ]
    },{
        children:[
            {
                path:"/",
                controller: controllers.main.index
            },{
                path:"/login",
                controller: controllers.main.loginPage,
                middleware: [ app.securityManager.csrfProtection ]
            },{
                path:"/login",
                method:"post",
                controller: controllers.main.login,
                middleware: [ app.securityManager.csrfProtection ]
            },{
                path: "/join",
                controller: controllers.main.registerPage
            },{
                path: "/logout",
                controller: controllers.main.logout
            },{
                path: "/resend_verify",
                controller: controllers.main.resend_verify_page
            },{
                path: "/resend_verify",
                method:'post',
                controller: controllers.main.resend_verify
            },{
                path: "/verify",
                controller: controllers.main.verify
            },{
                controller: controllers.main.errorHandler
            },{
                path: "*",
                controller: controllers.main.notFound
            }
        ]
    }
];
module.exports.router=require('../system').createRouterFromJson(routerJson);