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
        path:"/",
        controller: controllers.main.index
    },{
        path:"/login",
        controller: controllers.auth.loginPage,
        middleware: [ app.securityManager.csrfProtection ]
    },{
        path:"/login",
        method:"post",
        controller: controllers.auth.login,
        middleware: [ app.securityManager.csrfProtection ]
    },{
        path: "/join",
        controller: controllers.auth.registerPage
    },{
        path: "/logout",
        controller: controllers.auth.logout
    },{
        path: "/resend_verify",
        controller: controllers.auth.resend_verify_page
    },{
        path: "/resend_verify",
        method:'post',
        controller: controllers.auth.resend_verify
    },{
        path: "/verify",
        controller: controllers.auth.verify
    },{
        path: "/forgot",
        controller: controllers.auth.forgot_page
    },{
        path: "/forgot",
        method:"post",
        controller: controllers.auth.forgot
    },{
        path: "/reset",
        controller: controllers.auth.reset_page
    },{
        path: "/reset",
        method:"post",
        controller: controllers.auth.reset
    },{
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
            }
        ]
    },{
        path: "/admin",
        middleware: middleware.hasRole("admin"),
        children:[
            {
                path: "/",
                controller: controllers.admin.dashboard
            },{
                controller: controllers.main.errorHandler
            }
        ]
    },{
        middleware: middleware.shouldLogin,
        children:[
            {
                path: "/dashboard",
                controller: controllers.main.dashboard
            },{
                path: "/profile",
                controller: controllers.main.profile
            },{
                path: "/profile",
                method: "post",
                controller: controllers.main.save_profile
            }
        ]
    },{
        controller: controllers.main.errorHandler
    },{
        path: "*",
        controller: controllers.main.notFound
    }
];
exports.router=require('../system').createRouterFromJson(routerJson);