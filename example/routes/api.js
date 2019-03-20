module.exports=[
    {
        path:"/v1",
        children:[
            {
                path:"/hello",
                controller: "main.api.hello"
            }
        ]
    }
]