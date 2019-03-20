"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
function scanFiles(folder) {
    var scripts = [];
    try {
        fs.readdirSync(folder).forEach(function (file) {
            var f = path.parse(file);
            if (f.ext == ".js") {
                //if(f.name!="index")
                scripts.push(f.name);
            }
        });
    }
    catch (e) { }
    return scripts;
}
exports.scanFiles = scanFiles;
function joinURLs() {
    var urls = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        urls[_i] = arguments[_i];
    }
    var result = urls.map(function (url) {
        var u = url.trim();
        if (u.length) {
            if (u == "/")
                return "";
            else
                return u.startsWith("/") ? u : "/" + u;
        }
        else
            return "";
    }).join("");
    return result ? result : "/";
}
exports.joinURLs = joinURLs;
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
exports.isObject = isObject;
function mergeDeep(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    var _a, _b;
    if (!sources.length)
        return target;
    var source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (var key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, (_a = {}, _a[key] = {}, _a));
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, (_b = {}, _b[key] = source[key], _b));
            }
        }
    }
    return mergeDeep.apply(void 0, [target].concat(sources));
}
exports.mergeDeep = mergeDeep;
