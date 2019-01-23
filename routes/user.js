module.exports=[
    {
        path: "/dashboard",
        controller: "main.dashboard"
    },{
        path: "/profile",
        controller: "main.profile"
    },{
        path: "/profile",
        method: "post",
        controller: "main.save_profile"
    },{
        path:"/articles",
        children:[
            {
                path:"/",
                controller:"main.articleListPage"
            },{
                path:"/",
                method:"post",
                controller:"main.createArticle"
            },{
                path:"/new",
                controller:"main.newArticlePage"
            },{
                path:"/:id",
                controller:"main.articleEditPage"
            },{
                path:"/:id",
                method:"post",
                controller:"main.editArticle"
            },{
                path:"/:id/edit",
                controller:"main.articleEditPage"
            },{
                path:"/:id/delete",
                controller:"main.deleteArticle"
            }
        ]
    }
];