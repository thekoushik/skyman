"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SQLDatabase_1 = require("./SQLDatabase");
var NoSQLDatabase_1 = require("./NoSQLDatabase");
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.prototype.attach = function (settings, options, root, app) {
        if (options.db) {
            if (settings.db.type == 'sql' || settings.db.type == 'both') {
                var sql = new SQLDatabase_1.SQLDatabase(settings.db);
                sql.connect(global.config.db.sql)
                    .then(function () {
                    //console.log("Database Connected..");
                })
                    .catch(function (e) {
                    console.log(e);
                });
            }
            if (settings.db.type == 'nosql' || settings.db.type == 'both') {
                var nosql = new NoSQLDatabase_1.NoSQLDatabase(settings.db);
                nosql.connect(global.config.db.nosql)
                    .then(function () {
                    //console.log("Database Connected..");
                })
                    .catch(function (e) {
                    if (e.name == "MongoError")
                        console.log("Cannot connect to database. Please check your database connection.");
                    else
                        console.log(e);
                });
            }
        }
    };
    return Database;
}());
exports.Database = Database;
