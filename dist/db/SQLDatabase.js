"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SQLDatabase = /** @class */ (function () {
    function SQLDatabase(settings) {
        if (SQLDatabase.singleton)
            throw new Error("Database is already initialized, use the static methods.");
        SQLDatabase.singleton = this;
        this.settings = settings;
        this.driver = require('sequelize');
        this.options = {};
    }
    SQLDatabase.prototype.connect = function (config) {
        this.connection = new this.driver(config.uri || config);
        return this.connection.authenticate();
    };
    SQLDatabase.getInstance = function () {
        return SQLDatabase.singleton;
    };
    SQLDatabase.createModel = function (name, definition, option) {
        if (option === void 0) { option = {}; }
        return SQLDatabase.singleton.connection.define(name, definition, option);
    };
    SQLDatabase.type = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length == 0)
            return SQLDatabase.singleton.connection[name];
        else
            return SQLDatabase.singleton.connection[name].apply(null, args);
    };
    SQLDatabase.connection = function () {
        return SQLDatabase.singleton.connection;
    };
    return SQLDatabase;
}());
exports.SQLDatabase = SQLDatabase;
