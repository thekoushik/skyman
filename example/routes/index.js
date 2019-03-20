module.exports=[
    {
        path:"/",
        controller: "main.index"
    },{
        path:"/api",
        children:'api',
    },{
        controller: "main.errorHandler"
    },{
        path: "*",
        controller: "main.notFound"
    }
];