var createError = require('http-errors');
var { hasToken, hasTokenOrNot } = require('../system/kernel');
var cache = require('../system/cache');
var multer = require('multer');
var { safeExtension, createFolderIfNotExist } = require('../utils');

exports.hasToken = hasToken;
exports.hasTokenOrNot = hasTokenOrNot;

exports.shouldLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
    } else res.status(403).end();//res.redirect('/login?next='+req.originalUrl);
};

exports.hasRole = (role) => {
    return (req, res, next) => {
        if (!req.isAuthenticated())
            res.status(403).end(); //res.redirect('/login?next='+req.originalUrl);//;// next(new Error("You are not allowed to access this page"));
        else {
            if (req.user.role != role)
                return next(createError(403, 'You are not allowed to access this page', { code: 'ENEEDROLE' }));
            next();
        }
    };
};
exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated())
        res.status(403).end(); //res.redirect('/login?next='+req.originalUrl);//;// next(new Error("You are not allowed to access this page"));
    else {
        if (req.user.role != 'ADMIN')
            return next(createError(403, 'You are not allowed to access this page', { code: 'ENEEDROLE' }));
        next();
    }
};
///////    caching
exports.cmsCache = (req, res, next) => {
    let cache_path = 'response-cms-' + req.params.id;
    req.cache_path = cache_path;
    cache.getCache(cache_path).then((data) => {
        if (data) {
            res.set('Content-Type', 'application/json').send(data);
        } else {
            next();
        }
    }).catch((e) => {
        next();
    })
}

//////////file uploads
exports.profilePhoto = multer({
    storage: multer.diskStorage({
        destination: 'uploads/profile_photo/',
        filename: (req, file, cb) => {
            cb(null, req.user.role.toLowerCase() + req.user._id + '_' + Date.now() + safeExtension(file.originalname));
        }
    })
}).single('photo');

createFolderIfNotExist(["uploads/cms_images", "uploads/profile_photo"]);