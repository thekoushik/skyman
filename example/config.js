module.exports={
    development:{
        dbURI:'mongodb://127.0.0.1/skyman-demo',
        redis:{
            host: '127.0.0.1',
            port: 6379
        },
        email:{
            service: "gmail",
            auth: {
                user: "youremail@gmail.com",
                pass: "yourpassword"
            },
            skip:true
        },
        url: 'http://localhost:8000'
    },
    production:{
        dbURI:'mongodb://127.0.0.1/skyman-demo',
        redis:{
            host: '127.0.0.1',
            port: 6379
        },
        email:{
            service: "gmail",
            auth: {
                user: "youremail@gmail.com",
                pass: "yourpassword"
            },
            skip:false
        },
        url: 'http://localhost:8000'
    },
    test:{
        dbURI:'mongodb://127.0.0.1/skyman-demo',
        redis:{
            host: '127.0.0.1',
            port: 6379
        },
        email:{
            service: "gmail",
            auth: {
                user: "youremail@gmail.com",
                pass: "yourpassword"
            },
            skip:false
        },
        url: 'http://localhost:8000'
    }
}