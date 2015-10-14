var Cache = require('./lib/cache');

function RouteCache(options, req) {
	this.cache = new Cache(options);
	this.url = req.method + ' ' + req.url;
	this.req = req;
}

RouteCache.prototype.getBody = function() {
	this.body = this.cache.get(this.url);
	return this.body;
};

RouteCache.prototype.setBody = function(body) {
	this.body = this.cache.set(this.url, body);
	return this.body;
};

module.exports = RouteCache;