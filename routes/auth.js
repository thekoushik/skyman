var authController=require('../controllers').auth;
var middleware=require('../middlewares');

module.exports=[
    {
        path:"/login",
        controller: authController.loginPage,
        middleware: [ middleware.csrfProtection ]
    },{
        path:"/login",
        method:"post",
        controller: authController.login,
        middleware: [ middleware.csrfProtection ]
    },{
        path: "/join",
        controller: authController.registerPage
    },{
        path: "/logout",
        controller: authController.logout
    },{
        path: "/resend_verify",
        controller: authController.resend_verify_page
    },{
        path: "/resend_verify",
        method:'post',
        controller: authController.resend_verify
    },{
        path: "/verify",
        controller: authController.verify
    },{
        path: "/forgot",
        controller: authController.forgot_page
    },{
        path: "/forgot",
        method:"post",
        controller: authController.forgot
    },{
        path: "/reset",
        controller: authController.reset_page
    },{
        path: "/reset",
        method:"post",
        controller: authController.reset
    }
];