"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var utils_1 = require("../utils");
var RouterContainer_1 = require("./RouterContainer");
/**
 *
 */
var Router = /** @class */ (function () {
    function Router() {
        this.container = new RouterContainer_1.RouterContainer();
    }
    Router.prototype.addToTree = function (baseURL, json, method) {
        var url = utils_1.joinURLs(baseURL, json.path);
        if (!Router.routerTree[url])
            Router.routerTree[url] = {};
        if (Router.routerTree[url][method])
            throw new Error("Path " + url + " already exist");
        Router.routerTree[url][method] = {
            description: json.description || "",
            operationId: json.operationId || "",
            parameters: [],
            responses: {}
        };
    };
    Router.prototype.parseJSONRoutes = function (json, router, baseURL /*errorHandler?:any,notFoundHandler?:any*/) {
        if (Array.isArray(json)) {
            for (var i = 0; i < json.length; i++)
                this.parseJSONRoutes(json[i], router, baseURL);
        }
        else if (!json.path && json.controller) {
            router.use(this.container.getControllerEndpoint(json.controller));
        }
        else {
            var method = (json.method == undefined) ? "get" : json.method;
            if (json.controller) {
                var stack = [];
                if (json.path) {
                    this.addToTree(baseURL, json, method);
                    stack.push(json.path);
                }
                if (json.middleware) {
                    if (Array.isArray(json.middleware))
                        stack = stack.concat(this.container.getMiddlewareEndpoint(json.middleware));
                    else
                        stack.push(this.container.getMiddlewareEndpoint(json.middleware));
                }
                stack.push(this.container.getControllerEndpoint(json.controller));
                router[method].apply(router, stack);
            }
            else if (Array.isArray(json.children)) {
                var newRouter = express.Router({ mergeParams: true });
                if (json.middleware) {
                    if (Array.isArray(json.middleware))
                        this.container.getMiddlewareEndpoint(json.middleware).forEach(function (f) { return newRouter.use(f); });
                    else
                        newRouter.use(this.container.getMiddlewareEndpoint(json.middleware));
                }
                this.parseJSONRoutes(json.children, newRouter, utils_1.joinURLs(baseURL, json.path || ""));
                if (json.path)
                    router.use(json.path, newRouter);
                else
                    router.use(newRouter);
            }
            else if (json.view) {
                var stack = [];
                if (json.path) {
                    this.addToTree(baseURL, json, method);
                    stack.push(json.path);
                }
                stack.push(function (req, res) { return res.render(json.view); });
                router[method].apply(router, stack);
            }
            else if (json.redirect) {
                if (!json.path)
                    throw new Error("Redirect requires path");
                if (json.method == undefined)
                    method = 'all';
                router[method](json.path, function (req, res) { return res.redirect(json.redirect); });
            }
        }
    };
    Router.prototype.getRouter = function () {
        return this.router;
    };
    Router.prototype.attach = function (settings, options, root, app) {
        this.container.load(root);
        this.router = express.Router({ mergeParams: true });
        var json = require(root + '/routes');
        this.parseJSONRoutes(json, this.router, "");
        app.use(this.router);
    };
    Router.routerTree = {};
    return Router;
}());
exports.Router = Router;
