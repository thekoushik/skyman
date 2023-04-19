var { httpServer, httpsServer } = require('..');
var socketio = require('socket.io');
var io = new socketio();
io.attach(httpServer);
if (httpsServer) io.attach(httpsServer);
var jwt = require('jsonwebtoken');

//TODO: use redis to store/retrieve user connections
var users = {};
var admins = {};

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, config.auth.secret, (err, decoded) => {
            if (err) {
                //console.log('token mismatch');
                return next(new Error('Access Denied'));
            }
            //console.log(decoded);
            socket.decoded = decoded;
            next();
        });
    } else {
        //console.log('no token');
        next(new Error('Access Denied'));
    }
});
io.on('connection', (socket) => {
    //console.log('id',socket.id);
    let user_id = socket.decoded.sub;
    try {
        let role = Buffer.from(socket.decoded.sub2, 'base64').toString('ascii');
        if (role == 'ADMIN') {
            admins[user_id] = socket.id;
            console.log('admin')
        } else {
            console.log('connected user', user_id);
        }
    } catch (e) { }
    users[user_id] = socket.id;
    socket.emit('connected', 'Welcome');
    socket.on('join', (driver_id) => {
        socket.join('driver_' + driver_id);
    })
    socket.on('leave', (driver_id) => {
        socket.leave('driver_' + driver_id);
    });
    socket.on('disconnect', () => {
        console.log('disconnected user', user_id);
        delete users[user_id];
        if (admins[user_id]) delete admins[user_id];
    });
});
console.log('socket is listening..');
global.sendToClient = (client_id, send_type, data) => {
    if (!users[client_id]) return false;
    return io.to(users[client_id]).emit(send_type, data);
}
global.getActiveAdmin = () => {
    let keys = Object.keys(admins);
    return keys.length ? keys[0] : null;
}
global.sendToRoom = (room, send_type, data) => {
    return io.to(room).emit(send_type, data);
}
global.sendToMultipleClients = (client_id_array, send_type, data) => {
    let skt = null;
    let sent = [];
    for (let client_id of client_id_array) {
        if (!users[client_id]) continue;
        skt = skt ? skt.to(users[client_id]) : io.to(users[client_id]);
        sent.push(client_id);
    }
    if (skt) {
        skt.emit(send_type, data);
    }
    return sent;
}
