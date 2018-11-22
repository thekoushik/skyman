var userController=require('../controllers').main;

module.exports=[
    {
        path: "/dashboard",
        controller: userController.dashboard
    },{
        path: "/profile",
        controller: userController.profile
    },{
        path: "/profile",
        method: "post",
        controller: userController.save_profile
    },{
        path:"/articles",
        children:[
            {
                path:"/",
                controller:userController.articleListPage
            },{
                path:"/",
                method:"post",
                controller:userController.createArticle
            },{
                path:"/new",
                controller:userController.newArticlePage
            },{
                path:"/:id",
                controller:userController.articleEditPage
            },{
                path:"/:id",
                method:"post",
                controller:userController.editArticle
            },{
                path:"/:id/edit",
                controller:userController.articleEditPage
            },{
                path:"/:id/delete",
                controller:userController.deleteArticle
            }
        ]
    }
];