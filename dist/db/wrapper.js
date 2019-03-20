"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var DBWrapper = /** @class */ (function () {
    function DBWrapper() {
    }
    DBWrapper.prototype.attach = function (settings, options, root, app) {
        new _1.DB(settings.db);
    };
    return DBWrapper;
}());
exports.DBWrapper = DBWrapper;
