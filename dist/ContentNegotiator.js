"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContentNegotiator = /** @class */ (function () {
    function ContentNegotiator() {
    }
    ContentNegotiator.prototype.attach = function (settings, options, root, app) {
        app.use(require('helmet')(settings.helmet));
        app.use(require('cookie-parser')()); //this.settings.cookieparser
        var bodyParser = require('body-parser');
        for (var key in settings.bodyparser)
            app.use(bodyParser[key](settings.bodyparser[key]));
    };
    return ContentNegotiator;
}());
exports.ContentNegotiator = ContentNegotiator;
