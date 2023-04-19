const { hasRole, shouldLogin } = require('../../../middlewares');
const { userList, user, userCreate, info } = require('../../../controllers/api');

module.exports = [
    {
        name: "Get user list",
        path: "/users",
        controller: userList
    }, {
        path: "/users/:id",
        controller: user,
        middleware: [hasRole("admin")]
    }, {
        path: "/users",
        method: "post",
        controller: userCreate,
    }, {
        path: "/profile",
        controller: info,
        middleware: [shouldLogin]
    }
];