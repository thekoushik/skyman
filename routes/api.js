var middleware=require('../middlewares');

module.exports=[
    {
        path:"/users",
        controller: "api.userList"
    },{
        path:"/users/:id",
        controller: "api.user",
        middleware:[ middleware.hasRole("admin") ]
    },{
        path:"/users",
        method:"post",
        controller: "api.userCreate"
    },{
        path:"/profile",
        controller: "api.info",
        middleware:[ middleware.shouldLogin ]
    }
];