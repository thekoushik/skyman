"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var View = /** @class */ (function () {
    function View() {
        this.settings = {};
        View.singleton = this;
    }
    View.prototype.attach = function (settings, options, root, app) {
        this.settings = settings;
        this.driver = require('nunjucks');
        this.driver.configure("views", __assign({}, this.settings.view, { express: app }));
    };
    View.render = function (view_path, context) {
        var view = view_path;
        if (!view.endsWith('.html'))
            view += '.html';
        return new Promise(function (resolve, reject) {
            View.singleton.driver.render(view, context, function (err, str) {
                if (err)
                    reject(err);
                else
                    resolve(str);
            });
        });
    };
    return View;
}());
exports.View = View;
