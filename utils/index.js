var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var crypto = require('crypto');
const { exec } = require("child_process");
const bcrypt = require('bcrypt');

exports.createId = (str) => new mongoose.Types.ObjectId(str)
exports.toId = (str) => mongoose.Types.ObjectId(str)
exports.isValidId = (id) => mongoose.Types.ObjectId.isValid(id)
exports.isDataNotFound = (err) => err instanceof mongoose.CastError;
var dateAhead = exports.dateAhead = (dayAhead = 1) => {
    var date = new Date();
    date.setDate(date.getDate() + dayAhead);
    return date;
}
exports.minuteAheadFrom = (date, minuteAhead = 1) => {
    return new Date((new Date(date)).getTime() + minuteAhead * 60000);
}
var minuteAhead = exports.minuteAhead = (minuteAhead = 1) => {
    return new Date((new Date()).getTime() + minuteAhead * 60000);
}
exports.createToken = (dayAhead = 1) => {
    return {
        token: crypto.randomBytes(16).toString('hex'),
        expire_at: dateAhead(dayAhead)
    };
}
exports.createOTPToken = (digitCount = 4, minute = 30) => {
    var digits = '0123456789';
    let token = '';
    for (let i = 0; i < digitCount; i++)
        token += digits[Math.floor(Math.random() * 10)];
    return {
        token,
        expire_at: minuteAhead(minute)
    };
}
exports.createMD5Hash = (text) => crypto.createHash('md5').update(text).digest("hex");
exports.createBcryptHash = (text) => bcrypt.hash(text, 10);
exports.compareBcryptHash = (text, hash) => bcrypt.compare(text, hash);
exports.encodeAuthToken = (user, token) => Buffer.from(user + ':' + token, 'ascii').toString('base64')
exports.decodeAuthToken = (token) => {
    var data = Buffer.from(token, 'base64').toString('ascii').split(':');
    return { user: data[0], token: data[1] };
}
exports.snakeToCamel = (s) => {
    var ss = s.replace(/(\_\w)/g, function (m) { return m[1].toUpperCase(); });
    return ss[0].toUpperCase() + ss.substr(1);
}
exports.snakeToTitle = (str) => {
    str = str.replace('_', ' ');
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}
var scanFiles = exports.scanFiles = (folder) => {
    var scripts = [];
    fs.readdirSync(folder).forEach((file) => {
        var f = path.parse(file);
        if (f.ext == ".js") {
            //if(f.name!="index")
            scripts.push(f.name);
        } else if (fs.lstatSync(folder + path.sep + file).isDirectory()) {//if it is a directory, do things recursively
            var subscripts = scanFiles(folder + path.sep + file);
            scripts.push.apply(scripts, subscripts.map(m => file + "/" + m))//using front slash to generalize and to use in routes
        }
    });
    return scripts;
}
exports.startOfDay = (date) => {
    let d = date ? (new Date(date)) : (new Date());
    d.setHours(0, 0, 0, 0);
    return d;
}
var dateBetweenQuery = exports.dateBetweenQuery = (from, to) => {
    let q = {};
    if (from) {
        let d = new Date(from);
        d.setHours(0, 0, 0, 0);
        q.from = d;
    }
    if (to) {
        let d = new Date(to);
        d.setHours(23, 59, 59, 999);
        q.to = d;
    }
    return q;
}
exports.createDateRangeQuery = (date_from, date_to, fieldname) => {
    let q = {};
    if (date_from || date_to) {
        let created = dateBetweenQuery(date_from, date_to);
        q[fieldname] = {};
        if (date_from) q[fieldname]['$gte'] = created.from;
        if (date_to) q[fieldname]['$lte'] = created.to;
    }
    return q;
}
exports.queryToANDQuery = (obj) => {
    let and = [];
    for (let key in obj) and.push({ [key]: obj[key] });
    return {
        '$and': and
    };
}
exports.getBaseURL = (requestObj, port) => {
    return `${requestObj.protocol}://${requestObj.hostname}${port ? (':' + port) : ''}`
}
var padNumber = exports.padNumber = (count) => {
    let max = 3;
    if (count > 999) max = 5;
    else if (count > 99999) max = 7
    return (count + 1).toString().padStart(max, '0');
}
exports.createSerial = (count) => {
    return (new Date()).getFullYear().toString().substr(2) + padNumber(count)
}
exports.deleteBullyFile = (filename) => {
    return new Promise((res, rej) => {
        fs.unlink(appRoot + '/uploads/bully/' + filename, (err) => {
            if (err) rej(err);
            res(true);
        })
    })
}
var deleteFile = (file) => {
    return new Promise((res, rej) => {
        fs.unlink(appRoot + (file.startsWith("/") ? file : ('/' + file)), (err) => {
            if (err) res(false);
            res(file);
        })
    })
}
exports.deleteFiles = (files, folder) => {
    if (folder) path_name = folder;
    if (Array.isArray(files)) {
        return Promise.all(files.map(f => deleteFile((folder || '') + f)))
    } else {
        return deleteFile((folder || '') + files);
    }
}

exports.executeCMD = (cmd) => {
    return new Promise((res, rej) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                rej(error);
                return;
            }
            if (stderr) {
                rej(stderr);
                return;
            }
            res(stdout);
        });
    })
}
exports.copyFile = (src, dest) => {
    return new Promise((res, rej) => {
        fs.copyFile(appRoot + src, appRoot + dest, (err) => {
            if (err) rej(err);
            res(dest);
        })
    })
}
exports.escapeForRegex = (str) => {
    if (!str) return '';
    let result = str.replace(/[\\\(\)\{\}\[\]\^\$\*\+]/g, '');
    result = result.replace(/\./g, '\\.');
    return result;
}
exports.random_string = (length, onlyCaps) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + (onlyCaps ? '' : 'abcdefghijklmnopqrstuvwxyz') + '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.safeExtension = (str) => {
    if (str) return path.extname(str).replace(/\?.*/, '');
    else return str;
}
exports.createFileFromBase64 = (base64, file_path) => {
    return new Promise((res, rej) => {
        fs.writeFile(appRoot + (file_path.startsWith("/") ? file_path : ('/' + file_path)), base64, 'base64', (err) => {
            if (err) rej(err);
            else res(file_path);
        })
    })
}
exports.createFolderIfNotExist = (dir) => {
    let dir_paths = (!Array.isArray(dir) ? [dir] : dir);
    dir_paths.forEach(s => {
        let dir_path = appRoot + (s.startsWith("/") ? s : ('/' + s));
        if (!fs.existsSync(dir_path)) {
            fs.mkdirSync(dir_path);
        }
    })
}