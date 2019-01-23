module.exports=[
    {
        path:"/login",
        controller: "auth.loginPage",
        middleware: [ "index.csrfProtection" ]
    },{
        path:"/login",
        method:"post",
        controller: "auth.login",
        middleware: [ "index.csrfProtection" ]
    },{
        path: "/join",
        controller: "auth.registerPage"
    },{
        path: "/logout",
        controller: "auth.logout"
    },{
        path: "/resend_verify",
        controller: "auth.resend_verify_page"
    },{
        path: "/resend_verify",
        method:'post',
        controller: "auth.resend_verify"
    },{
        path: "/verify",
        controller: "auth.verify"
    },{
        path: "/forgot",
        controller: "auth.forgot_page"
    },{
        path: "/forgot",
        method:"post",
        controller: "auth.forgot"
    },{
        path: "/reset",
        controller: "auth.reset_page"
    },{
        path: "/reset",
        method:"post",
        controller: "auth.reset"
    }
];