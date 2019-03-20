"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var local_1 = __importDefault(require("./local"));
var passport = require('passport');
var DefaultAuthProvider = /** @class */ (function () {
    function DefaultAuthProvider() {
    }
    DefaultAuthProvider.prototype.getUserByCredentials = function (username, password) {
        if (username == "skyman" && password == "skyman")
            return Promise.resolve({ id: username });
        else
            return Promise.reject(null);
    };
    DefaultAuthProvider.prototype.getUserById = function (id) {
        return Promise.resolve({ id: id });
    };
    DefaultAuthProvider.prototype.getUserID = function (user) {
        return user.id;
    };
    return DefaultAuthProvider;
}());
var SupportedStrategies = {
    local: local_1.default
};
var Auth = /** @class */ (function () {
    function Auth() {
    }
    Auth.prototype.attach = function (settings, options, root, app) {
        this.settings = settings.auth;
        if (!settings.auth)
            return;
        if (!SupportedStrategies[this.settings.strategy.toLowerCase()])
            throw new Error('Unsupported strategy: ' + this.settings.strategy);
        if (this.settings.provider == 'default')
            this.settings.provider = new DefaultAuthProvider();
        else {
            this.settings.provider = require(root + "/database/providers/" + this.settings.provider);
        }
        app.use(passport.initialize());
        app.use(passport.session());
        SupportedStrategies[this.settings.strategy.toLowerCase()](passport, this.settings);
    };
    Auth.authenticate = function (req, res, next, cb) {
        passport.authenticate('local', cb)(req, res, next);
    };
    return Auth;
}());
exports.Auth = Auth;
