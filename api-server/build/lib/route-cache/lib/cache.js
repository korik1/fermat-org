var fs = require('fs');
var path = require('path');
var winston = require('winston');
var Route = require('./route');
/**
 * [Cache description]
 *
 * @method Cache
 *
 * @param  {[type]} options [description]
 */
function Cache(options) {
    'use strict';
    if (options) {
        this.type = options.type || 'memory';
        this.time = options.time || 3600000;
        if (this.type === 'file') {
            var env = process.env.NODE_ENV || 'development',
                folder = path.join(process.cwd(), 'cache', env),
                file = options.filename || 'filecache.json';
            this.filename = path.join(folder, file);
        }
    } else {
        this.type = 'memory';
        this.time = 3600000;
    }
}
/**
 * [clear description]
 *
 * @method clear
 *
 * @return {[type]} [description]
 */
Cache.prototype.clear = function () {
    'use strict';
    try {
        if (this.type === 'file') {
            fs.unlinkSync(this.filename);
        } else {
            global.memcache = {};
        }
        return true;
    } catch (err) {
        winston.log('error', 'Error deleting file cache', err);
    }
};
/**
 * [set description]
 *
 * @method set
 *
 * @param  {[type]} url    [description]
 * @param  {[type]} body   [description]
 */
Cache.prototype.set = function (url, body) {
    'use strict';
    var cache;
    try {
        if (this.type === 'file') {
            var filecache = fs.readFileSync(this.filename);
            cache = JSON.parse(filecache);
        } else {
            cache = global.memcache;
        }
    } catch (err) {
        winston.log('error', 'Error reading or parsing file cache', err);
    }
    var route;
    if (cache) {
        if (cache[url]) {
            var routecache = new Route(cache[url].body, cache[url].date, this.time);
            if (!routecache.isValid() || !routecache.body) {
                route = new Route(body, null, this.time);
                cache[url] = route;
            } else {
                winston.log('info', 'Route still in cache');
            }
        } else {
            route = new Route(body, null, this.time);
            cache[url] = route;
        }
    } else {
        cache = {};
        route = new Route(body, null, this.time);
        cache[url] = route;
    }
    if (this.type === 'file') {
        var data = JSON.stringify(cache);
        fs.writeFile(this.filename, data, {
            flags: 'w'
        }, function (err) {
            if (err) {
                winston.log('error', 'Error reading or parsing file cache', err);
            }
        });
        return cache[url];
    }
    global.memcache = cache;
    return cache[url];
};
/**
 * [get description]
 *
 * @method get
 *
 * @param  {[type]} url [description]
 *
 * @return {[type]} [description]
 */
Cache.prototype.get = function (url) {
    'use strict';
    var cache;
    try {
        if (this.type === 'file') {
            var filecache = fs.readFileSync(this.filename);
            cache = JSON.parse(filecache);
            winston.log('info', 'Searching on file cache');
        } else {
            cache = global.memcache;
            winston.log('info', 'Searching on memory cache');
        }
    } catch (err) {
        winston.log('error', 'Error reading or parsing file cache', err);
    }
    if (cache) {
        if (cache[url]) {
            var routecache = new Route(cache[url].body, cache[url].date, this.time);
            if (!routecache.isValid() || !routecache.body) {
                winston.log('info', 'Route in cache expired');
                return undefined;
            } else {
                winston.log('info', 'Route still in cache');
                winston.log('info', 'Retrieving from cache');
                return cache[url];
            }
        } else {
            return undefined;
        }
    }
    winston.log('info', 'Not found in cache');
    return undefined;
};
/**
 * [del description]
 *
 * @method del
 *
 * @param  {[type]} url [description]
 *
 * @return {[type]} [description]
 */
Cache.prototype.del = function (url) {
    'use strict';
    var cache;
    try {
        if (this.type === 'file') {
            var filecache = fs.readFileSync(this.filename);
            cache = JSON.parse(filecache);
        } else {
            cache = global.memcache;
        }
    } catch (err) {
        winston.log('error', 'Error reading or parsing file cache', err);
    }
    var route;
    if (cache) {
        if (cache[url]) {
            route = cache[url];
            delete cache[url];
        }
    }
    if (this.type === 'file') {
        var data = JSON.stringify(cache);
        fs.writeFile(this.filename, data, {
            flags: 'w'
        }, function (err) {
            if (err) {
                winston.log('error', 'Error reading or parsing file cache', err);
            }
        });
        return route;
    }
    global.memcache = cache;
    return route;
};
module.exports = Cache;