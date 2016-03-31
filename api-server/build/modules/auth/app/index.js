var appSrv = require('./services/app');
var AppMdl = require('./models/app');


/**
 * [insOrUpdApp description]
 * @param  {[type]}   _owner_id [description]
 * @param  {[type]}   name      [description]
 * @param  {[type]}   desc      [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
exports.insApp = function(_owner_id, name, desc, callback) {
	'use strict';
	try {
		var app = new AppMdl(_owner_id, name, desc);
		appSrv.insApp(app, function(err_ins, res_ins) {
			if (err_ins) {
				return callback(err_ins, null);
			}
			return callback(null, res_ins);
		});
	} catch (err) {
		return callback(err, null);
	}
};

/**
 * [getApps description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getApps = function(callback) {
	'use strict';
	try {
		appSrv.findAllApps({}, {}, function(err, apps) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, apps);
		});
	} catch (err) {
		return callback(err, null);
	}
};

/**
 * [delAllApps description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.delAllApps = function(callback) {
	'use strict';
	try {
		appSrv.delAllApps(function(err, apps) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, true);
		});
	} catch (err) {
		return callback(err, null);
	}
};

/**
 * [findAppById description]
 * @param  {[type]}   _id      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAppById = function(_id, callback) {
	appSrv.findAppById(_id, function(err_app, res_app) {
		if (err_app) {
			return callback(err_app, null);
		}
		return callback(null, res_app);
	});
};

/**
 * [findAppByApiKey description]
 * @param  {[type]}   api_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAppByApiKey = function(api_key, callback) {
	appSrv.findAppByApiKey(api_key, function(err_app, res_app) {
		if (err_app) {
			return callback(err_app, null);
		}
		return callback(null, res_app);
	});
};