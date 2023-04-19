var express = require('express');
var { scanFiles } = require('../utils');
var cache = require('./cache');
var controllers = {};
var middlewares = {};

scanFiles('controllers').forEach((c) => {
    controllers[c] = require('../controllers/' + c);
});
scanFiles('middlewares').forEach((c) => {
    middlewares[c] = require('../middlewares/' + c);
});

const handler = (fn) => {
    return async (req, res) => {
        try {
            var result = await fn(req);
            if (result === null) {
                //check file to be deleted
                return sendError(res, null, 'Not found', 404);
            }
            if (result.status != undefined && result.status === false && result.message) {
                sendError(res, null, result.message, 200);
            } else {
                if (req.cache_path) {
                    let json = sendData(res, result.data || '', result.message, 200, result.extra || {})
                    try { await cache.setCache(req.cache_path, JSON.stringify(json)) } catch (e) { }
                } else {
                    sendData(res, result.data || '', result.message, 200, result.extra || {})
                }
            }
        } catch (e) {
            console.log('handler error');
            console.log(e)
            if (typeof e == 'string')
                sendError(res, '', e);
            else if (e && e.validation_error) {
                let keys = Object.keys(e.validation_error);
                if (keys.length)
                    sendError(res, e.validation_error, e.validation_error[keys[0]] || 'Validation error', 200);
                else
                    sendError(res, e.validation_error, 'Validation error', 200);
            } else if (e.name == 'ValidationError')
                sendError(res, gatemanMongooseError(e), 'Validation error', 200)
            else if (e.name == 'CastError')
                sendError(res, null, 'Not found', 404);
            else
                sendError(res, e);
        }
    }
}
//var notFound=(req,res)=>{res.status(404).end();}// .render('error/404.html',{origin:req.originalUrl});
var errorHandler = (err, req, res, next) => {
    console.log('err code', err.code);
    console.log('err msg', err.message);
    if (err.code === 'EBADCSRFTOKEN')
        res.status(403).send({
            status: false,
            message: 'Page Expired!'
        });
    else if (err.code === 'ENEEDROLE')
        res.status(503).json({
            status: false,
            message: 'Access denied',
        })// render("error/403.html");
    else if (err.code === 'LIMIT_UNEXPECTED_FILE')
        res.status(200).json({
            status: false,
            message: 'Max number of files exceeded',
        })
    else if (err.code === '404')
        res.status(404).end();
    else if (err.code) {
        if (typeof err.code != "number")
            res.status(500).json({
                status: false,
                message: err.message || err.code,
                error: err.error || err
            });
        else
            res.status(err.code).json({
                status: false,
                message: err.message,
                error: err.error
            });
    } else if (err)
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: err
        });//.render('error/500.html',{err:err});
    else next();
};
var getControllerEndpoint = (json) => {
    let name = json.controller;
    if (typeof name == "function")
        return name;
    else if (typeof name != "string")
        throw new Error("Controller should be string or function.");
    var [controller_name, fn] = name.split(".", 2);
    if (!controllers[controller_name]) throw new Error("Controller '" + controller_name + "' not found");
    if (!controllers[controller_name][fn]) throw new Error("Endpoint '" + fn + "' not found in '" + controller_name + "'");
    if (json.raw)//for raw routes, do basic process
        return controllers[controller_name][fn]
    else//for non-raw route, process response and error handling
        return handler(controllers[controller_name][fn]);
}
var getMiddlewareEndpoint = (name) => {
    if (Array.isArray(name)) {
        return name.map(getMiddlewareEndpoint)
    } else {
        if (typeof name == "function")
            return name;
        var [middleware_name, fn] = name.split(".", 2);
        if (!middlewares[middleware_name]) throw new Error("Middleware '" + middleware_name + "' not found");
        if (!middlewares[middleware_name][fn]) throw new Error("Endpoint '" + fn + "' not found in '" + middleware_name + "'");
        if (typeof middlewares[middleware_name][fn] !== "function") throw new Error("Middleware " + middleware_name + "." + fn + " is not a function");
        return middlewares[middleware_name][fn];
    }
}

//TODO: automatic/default errorHandler and notFoundHandler for array routes
function parseJSONRoutes(json, router/*,errorHandler,notFoundHandler*/) {
    if (Array.isArray(json)) {
        for (var i = 0; i < json.length; i++)
            parseJSONRoutes(json[i], router);
        router.use(errorHandler);
        router.all('*', (_, res) => res.status(404).end());
    } else if (!json.path && json.controller) {
        router.use(getControllerEndpoint(json));//.controller
    } else {
        if (json.controller) {
            var stack = json.path != undefined ? [json.path] : [];
            if (json.middleware) {
                if (Array.isArray(json.middleware))
                    stack = stack.concat(getMiddlewareEndpoint(json.middleware));
                else
                    stack.push(getMiddlewareEndpoint(json.middleware));
            }
            stack.push(getControllerEndpoint(json));//.controller
            router[(json.method == undefined) ? "get" : json.method].apply(router, stack);
        } else if (Array.isArray(json.children)) {
            var newRouter = express.Router({ mergeParams: true });
            if (json.middleware) {
                if (Array.isArray(json.middleware))
                    getMiddlewareEndpoint(json.middleware).forEach((f) => newRouter.use(f));
                else
                    newRouter.use(getMiddlewareEndpoint(json.middleware));
            }
            parseJSONRoutes(json.children, newRouter);
            if (json.path)
                router.use(json.path, newRouter);
            else
                router.use(newRouter);
        } else if (json.view) {
            var stack = json.path != undefined ? [json.path] : [];
            if (json.middleware) {
                if (Array.isArray(json.middleware))
                    stack = stack.concat(getMiddlewareEndpoint(json.middleware));
                else
                    stack.push(getMiddlewareEndpoint(json.middleware));
            }
            stack.push((req, res) => {
                res.sendFile('views/' + json.view, { root: appRoot });
            });
            router[(json.method == undefined) ? "get" : json.method].apply(router, stack);
        }
    }
}

exports.createRouterFromJson = function (json) {
    var router = express.Router({ mergeParams: true });
    parseJSONRoutes(json, router);
    return router;
}