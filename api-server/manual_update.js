var winston = require('winston');
var loadLib = require('./modules/repository/lib/loader');
var Cache = require('./lib/route-cache');
var db = require('./db');
var cache = new Cache({
	type: 'file'
});
winston.log('info', 'Attempting manual update...');
loadLib.updDevs(function (err, res) {
	'use strict';
	if (err) {
		winston.log('error', err.message, err);
	} else {
		winston.log('debug', 'Developers updated', res);
		loadLib.loadComps(function (err, res) {
			if (err) {
				winston.log('error', err.message, err);
			} else {
				winston.log('debug', 'Components and processes loaded', res);
				cache.clear();
			}
		});
	}
});