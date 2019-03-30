"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContentNegotiator_1 = require("./ContentNegotiator");
var view_1 = require("./view");
var Session_1 = require("./Session");
var auth_1 = require("./auth");
var router_1 = require("./router");
var db_1 = require("./db");
var FeatherOrder = [
    new view_1.View(),
    new ContentNegotiator_1.ContentNegotiator(),
    new Session_1.Session(),
    new db_1.Database(),
    new auth_1.Auth(),
    new router_1.Router()
];
function bootstrap(ctx) {
    FeatherOrder.forEach(function (feather) { return feather.attach(ctx.settings, ctx.options, ctx.root, ctx.app); });
}
exports.default = bootstrap;
