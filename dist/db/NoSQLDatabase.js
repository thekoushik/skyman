"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NoSQLDatabase = /** @class */ (function () {
    function NoSQLDatabase(settings) {
        if (NoSQLDatabase.singleton)
            throw new Error("Database is already initialized, use the static methods.");
        NoSQLDatabase.singleton = this;
        this.settings = settings;
        var mongoose = require('mongoose');
        mongoose.set('useCreateIndex', true);
        //mongoose.Promise=global.Promise;
        mongoose.plugin(function (schema, options) {
            var indexes = schema.indexes();
            if (indexes.length == 0)
                return;
            var postHook = function (error, _, next) {
                if (error.name == 'MongoError' && error.code == 11000) {
                    var regex = /index: (.+) dup key:/;
                    var matches = regex.exec(error.message);
                    if (matches) {
                        var first_match = matches[1];
                        for (var i = 0; i < indexes.length; i++) {
                            for (var field in indexes[i][0]) {
                                if (indexes[i][1].unique && (first_match.indexOf('$' + field) > 0 || first_match.startsWith(field + '_'))) {
                                    var e = {};
                                    e[field] = new mongoose.Error.ValidatorError({
                                        type: 'unique',
                                        path: field,
                                        message: '"' + field + '" already exist'
                                    });
                                    var beautifiedError = new mongoose.Error.ValidationError();
                                    beautifiedError.errors = e;
                                    return next(beautifiedError);
                                }
                            }
                        }
                    }
                }
                next(error);
            };
            schema.post('save', postHook);
            schema.post('update', postHook);
            schema.post('findOneAndUpdate', postHook);
        });
        this.options = { useNewUrlParser: true };
        NoSQLDatabase.driver = mongoose;
        NoSQLDatabase.schemaBuilder = mongoose.Schema;
    }
    NoSQLDatabase.prototype.connect = function (config) {
        return NoSQLDatabase.driver.connect(config.uri, this.options);
    };
    NoSQLDatabase.getInstance = function () {
        return NoSQLDatabase.singleton;
    };
    NoSQLDatabase.createModel = function (name, definition, option) {
        if (option === void 0) { option = {}; }
        return NoSQLDatabase.driver.model(name, new NoSQLDatabase.schemaBuilder(definition, option));
    };
    NoSQLDatabase.type = function (name) {
        return NoSQLDatabase.schemaBuilder.Types[name];
    };
    NoSQLDatabase.connection = function () {
        return NoSQLDatabase.driver;
    };
    return NoSQLDatabase;
}());
exports.NoSQLDatabase = NoSQLDatabase;
