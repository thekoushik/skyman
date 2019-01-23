module.exports={
    development:{
        mongoURI:'mongodb://127.0.0.1/skyman-demo',
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
            skip:false,
        },
        url: 'http://localhost:8000'
    },
    production:{
        mongoURI:'mongodb://127.0.0.1/skyman-demo',
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
            skip:false,
        },
        url: 'http://localhost:8000'
    },
    test:{
        mongoURI:'mongodb://127.0.0.1/skyman-demo',
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
            skip:false,
        },
        url: 'http://localhost:8000'
    }
}