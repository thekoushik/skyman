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
var NoSQLConnector = /** @class */ (function (_super) {
    __extends(NoSQLConnector, _super);
    function NoSQLConnector() {
        var _this = _super.call(this) || this;
        var mongoose = require('mongoose');
        mongoose.set('useCreateIndex', true);
        //mongoose.Promise=global.Promise;
        mongoose.plugin(function (schema, options) {
            var indexes = schema.indexes();
            if (indexes.length == 0)
                return;
            var postHook = function (error, _, next) {
                if (error.name == 'MongoError' && error.code == 11000) {
                    var regex = /index: (.+) dup key:/;
                    var matches = regex.exec(error.message);
                    if (matches) {
                        var first_match = matches[1];
                        for (var i = 0; i < indexes.length; i++) {
                            for (var field in indexes[i][0]) {
                                if (indexes[i][1].unique && (first_match.indexOf('$' + field) > 0 || first_match.startsWith(field + '_'))) {
                                    var e = {};
                                    e[field] = new mongoose.Error.ValidatorError({
                                        type: 'unique',
                                        path: field,
                                        message: '"' + field + '" already exist'
                                    });
                                    var beautifiedError = new mongoose.Error.ValidationError();
                                    beautifiedError.errors = e;
                                    return next(beautifiedError);
                                }
                            }
                        }
                    }
                }
                next(error);
            };
            schema.post('save', postHook);
            schema.post('update', postHook);
            schema.post('findOneAndUpdate', postHook);
        });
        _this.options = { useNewUrlParser: true };
        _this.driver = mongoose;
        return _this;
    }
    NoSQLConnector.prototype.connect = function (config) {
        return this.driver.connect(config.uri, this.options);
    };
    NoSQLConnector.prototype.createModel = function (name, definition, option) {
        if (option === void 0) { option = {}; }
        return this.driver.model(name, new this.driver.Schema(definition, option));
    };
    NoSQLConnector.prototype.type = function (name, args) {
        return this.driver.Schema.Types[name];
    };
    NoSQLConnector.prototype.getConnection = function () {
        return this.driver;
    };
    return NoSQLConnector;
}(BasicDBConnector_1.default));
exports.default = NoSQLConnector;
