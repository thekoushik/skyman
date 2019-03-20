"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BasicDBConnector_1 = __importDefault(require("./BasicDBConnector"));
var SQLConnector = /** @class */ (function (_super) {
    __extends(SQLConnector, _super);
    function SQLConnector() {
        var _this = _super.call(this) || this;
        _this.driver = require('sequelize');
        _this.options = {};
        return _this;
    }
    SQLConnector.prototype.connect = function (config) {
        this.connection = new this.driver(config.uri || config);
        return this.connection.authenticate();
    };
    SQLConnector.prototype.createModel = function (name, definition, option) {
        if (option === void 0) { option = {}; }
        return this.connection.define(name, definition, option);
    };
    SQLConnector.prototype.type = function (name, args) {
        if (args.length == 0)
            return this.connection[name];
        else
            return this.connection[name].apply(null, args);
    };
    SQLConnector.prototype.getConnection = function () {
        return this.connection;
    };
    return SQLConnector;
}(BasicDBConnector_1.default));
exports.default = SQLConnector;
