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
var InMemoryDBConnector = /** @class */ (function (_super) {
    __extends(InMemoryDBConnector, _super);
    function InMemoryDBConnector() {
        return _super.call(this) || this;
    }
    InMemoryDBConnector.prototype.connect = function (config) {
        console.log('Connecting in-memory database..');
        return this.driver.connect(config.uri, this.options);
    };
    InMemoryDBConnector.prototype.createModel = function (name, definition, option) {
        if (option === void 0) { option = {}; }
        return null; //this.driver.model(name,new this.driver.Schema(definition,option));
    };
    InMemoryDBConnector.prototype.type = function (name, args) {
        return null;
    };
    InMemoryDBConnector.prototype.getConnection = function () {
        return null;
    };
    return InMemoryDBConnector;
}(BasicDBConnector_1.default));
exports.default = InMemoryDBConnector;
