var apicontroller=require('../controllers').api;
var middleware=require('../middlewares');

module.exports=[
    {
        path:"/users",
        controller: apicontroller.userList
    },{
        path:"/users/:id",
        controller: apicontroller.user,
        middleware:[ middleware.hasRole("admin") ]
    },{
        path:"/users",
        method:"post",
        controller: apicontroller.userCreate
    },{
        path:"/profile",
        controller: apicontroller.info,
        middleware:[ middleware.shouldLogin ]
    }
];