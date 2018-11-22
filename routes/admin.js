var controllers=require('../controllers');
module.exports=[
    {
        path: "/dashboard",
        controller: controllers.admin.dashboard
    },{
        controller: controllers.main.errorHandler
    }
]