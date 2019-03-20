"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Session = /** @class */ (function () {
    function Session() {
    }
    Session.prototype.attach = function (settings, options, root, app) {
        if (settings.session) {
            var sessionConfig = settings.session;
            var expressSession = require('express-session');
            //make sure redis is running before starting your application
            if (settings.redis) {
                var RedisStore = require('connect-redis')(expressSession);
                sessionConfig.store = new RedisStore(settings.redis);
            }
            app.use(expressSession(sessionConfig));
            if (options.flash) {
                app.use(require("connect-flash")(settings.flash));
                var view_1 = require(root + '/utils').view;
                app.use(function (req, res, next) {
                    res.locals.request = req; //provide access to request object from response
                    res.locals.view = view_1; //utility functions for view
                    //old function to access old data
                    var old = req.flash('_old_');
                    old = old.length ? old[0] : {};
                    res.locals.old = function (prop, default_data) { return (old[prop] == undefined) ? default_data : old[prop]; };
                    next();
                });
            }
        }
    };
    return Session;
}());
exports.Session = Session;
