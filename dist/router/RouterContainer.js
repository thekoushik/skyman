"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var RouterContainer = /** @class */ (function () {
    function RouterContainer() {
        this.controllers = {};
        this.middlewares = {};
        this.errorHandlers = {};
    }
    RouterContainer.prototype.getControllerEndpoint = function (name) {
        if (typeof name == "function")
            return name;
        var _a = name.split(".", 2), controller_name = _a[0], fn = _a[1];
        if (!this.controllers[controller_name])
            throw new Error("Controller '" + controller_name + "' not found");
        if (!this.controllers[controller_name][fn])
            throw new Error("Endpoint '" + fn + "' not found in '" + controller_name + "'");
        return this.controllers[controller_name][fn];
    };
    RouterContainer.prototype.getMiddlewareEndpoint = function (name) {
        if (Array.isArray(name)) {
            return name.map(this.getMiddlewareEndpoint.bind(this));
        }
        else {
            if (typeof name == "function")
                return name;
            var _a = name.split(".", 2), middleware_name = _a[0], fn = _a[1];
            if (!this.middlewares[middleware_name])
                throw new Error("Middleware '" + middleware_name + "' not found");
            if (!this.middlewares[middleware_name][fn])
                throw new Error("Endpoint '" + fn + "' not found in '" + middleware_name + "'");
            return this.middlewares[middleware_name][fn];
        }
    };
    RouterContainer.prototype.load = function (root) {
        var _this = this;
        utils_1.scanFiles(root + '/controllers').forEach(function (c) {
            _this.controllers[c] = require(root + '/controllers/' + c);
        });
        utils_1.scanFiles(root + '/middlewares').forEach(function (c) {
            _this.middlewares[c] = require(root + '/middlewares/' + c);
        });
    };
    return RouterContainer;
}());
exports.RouterContainer = RouterContainer;
