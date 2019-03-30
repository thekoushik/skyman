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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var Settings_1 = require("./common/Settings");
var Options_1 = require("./common/Options");
var bootstrap_1 = __importDefault(require("./bootstrap"));
var router_1 = require("./router");
var utils_1 = require("./utils");
/**
 *
 */
var Skyman = /** @class */ (function () {
    function Skyman(options) {
        this.loaded = false;
        this.root = '';
        this.config = {};
        this.app = express();
        this.options = __assign({}, Options_1.DefaultOptions, (options || {}));
        this.settings = __assign({}, Settings_1.DefaultSettings);
    }
    /**
     * Loads the settings from "system\settings.js" and the main application
     *
     * @param root Application directory
     */
    Skyman.prototype.load = function (root) {
        if (root === void 0) { root = "."; }
        if (this.loaded)
            throw new Error("Application already loaded");
        this.root = root;
        this.config = require(this.root + "/config.js");
        this.settings = utils_1.mergeDeep({}, this.settings, require(this.root + "/system/settings.js"));
        global.config = this.config[process.env.mode || 'development'];
        for (var key in this.settings.statics)
            this.app.use(key, express.static(this.settings.statics[key]));
        bootstrap_1.default({ settings: this.settings, options: this.options, root: this.root, app: this.app });
        this.loaded = true;
    };
    Skyman.prototype.fly = function (cb) {
        var _this = this;
        this.app.listen(this.options.port, cb || (function () {
            console.log('Skyman is flying on port', _this.options.port);
            for (var route in router_1.Router.routerTree) {
                for (var method in router_1.Router.routerTree[route]) {
                    console.log(method.toUpperCase() + "\t" + route + "\t" + router_1.Router.routerTree[route][method].operationId);
                }
            }
        }));
    };
    return Skyman;
}());
exports.Skyman = Skyman;
