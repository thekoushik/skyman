"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NoSQLConnector_1 = __importDefault(require("./NoSQLConnector"));
var SQLConnector_1 = __importDefault(require("./SQLConnector"));
/**
 *
 */
var DB = /** @class */ (function () {
    function DB(settings) {
        if (DB.singleton)
            throw new Error("Database is already initialized, use the static methods.");
        DB.singleton = this;
        //this.connector=new InMemoryDBConnector();
        this.settings = settings;
        if (this.settings.nosql) {
            this.connector = new NoSQLConnector_1.default();
        }
        else {
            this.connector = new SQLConnector_1.default();
        }
    }
    DB.prototype.connect = function (config) {
        return this.connector.connect(config);
    };
    DB.getInstance = function () {
        return DB.singleton;
    };
    DB.createModel = function (name, definition, option) {
        if (option === void 0) { option = {}; }
        return DB.singleton.connector.createModel(name, definition, option);
    };
    DB.type = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return DB.singleton.connector.type(name, args);
    };
    DB.connection = function () {
        return DB.singleton.connector.getConnection();
    };
    return DB;
}());
exports.DB = DB;
