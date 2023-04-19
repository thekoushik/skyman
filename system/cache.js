const redis = require('redis');
const { promisify } = require('util');

const CACHE_TIMEOUT = 60 * 60 * 12;

const client = redis.createClient(global.config.redis);

const redis_get = promisify(client.get).bind(client);
const redis_set = promisify(client.setex).bind(client);
const redis_del = promisify(client.unlink).bind(client);

exports.getCache = (key) => {
    return redis_get(key);
}
exports.setCache = (key, value) => {
    return redis_set(key, CACHE_TIMEOUT, value);
}
exports.setCacheFor = (key, value, seconds) => {
    return redis_set(key, seconds, value);
}
exports.removeCache = (key) => {
    return redis_del(key);
}
