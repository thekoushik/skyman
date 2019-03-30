"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var InMemoryDatabase = /** @class */ (function () {
    function InMemoryDatabase(settings) {
        if (InMemoryDatabase.singleton)
            throw new Error("Database is already initialized, use the static methods.");
        InMemoryDatabase.singleton = this;
        this.settings = settings;
    }
    InMemoryDatabase.prototype.connect = function (config) {
        return Promise.resolve(true);
    };
    InMemoryDatabase.getInstance = function () {
        return InMemoryDatabase.singleton;
    };
    InMemoryDatabase.createModel = function (name, definition, option) {
        if (option === void 0) { option = {}; }
        return true;
    };
    InMemoryDatabase.type = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return true;
    };
    InMemoryDatabase.connection = function () {
        return true;
    };
    return InMemoryDatabase;
}());
exports.InMemoryDatabase = InMemoryDatabase;
