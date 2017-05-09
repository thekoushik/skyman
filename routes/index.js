var app = require('../index');
var express = require('express');
var middleware = require('../middlewares');
var controllers = require('../controllers');

var apiRouter = express.Router();
apiRouter.get('/users',controllers.api.userList);
apiRouter.get('/user/:id',middleware.hasRole("admin"),controllers.api.user);
apiRouter.post('/register',controllers.api.userCreate);
apiRouter.get('/profile', middleware.shouldLogin, controllers.api.info);
apiRouter.use(controllers.main.errorHandler);

app.use('/api',apiRouter);

var mainRouter = express.Router();
mainRouter.get('/',controllers.main.index);
mainRouter.get('/login',app.securityManager.csrfProtection, controllers.main.loginPage);
mainRouter.post('/login',app.securityManager.csrfProtection, controllers.main.login);
mainRouter.get('/join',controllers.main.registerPage);
mainRouter.get('/logout',controllers.main.logout);
mainRouter.use(controllers.main.errorHandler);
mainRouter.get('*', controllers.main.notFound);

app.use(mainRouter);