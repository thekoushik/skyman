"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
exports.DefaultSettings = {
    statics: {
        "/static": "static"
    },
    bodyparser: {
        json: { limit: '10mb' },
        urlencoded: { extended: true, limit: '10mb', parameterLimit: 1000000 }
    },
    cookieparser: {},
    helmet: {},
    session: {
        secret: "skymansecret",
        resave: true,
        saveUninitialized: true,
    },
    redis: false,
    flash: {},
    auth: {
        strategy: "local",
        fields: {
            usernameField: "username",
            passwordField: "password",
        },
        provider: 'default',
    },
    view: {
        autoescape: true
    },
    db: {
        directory: "database",
        type: 'sql' //sql , nosql , both
    }
};
