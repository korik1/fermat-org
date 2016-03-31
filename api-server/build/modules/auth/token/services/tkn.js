var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var TknMdl = require('../models/tkn');
var tknSch = require('../schemas/tkn');
var AppMdl = require('../../app/models/app');
var appSch = require('../../app/schemas/app');
var UsrMdl = require('../../user/models/usr');
var usrSch = require('../../user/schemas/usr');
/**
 * [compDao description]
 *
 * @type {Dao}
 */
var tknDao = new Dao('Tkn', tknSch, TknMdl, 'App', appSch, AppMdl, 'Usr', usrSch, UsrMdl);

/**
 * [insTkn description]
 * @param  {[type]}   tkn_mdl  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.insTkn = function(tkn_mdl, callback) {
	'use strict';
	tknDao.insertSchema(tkn_mdl, function(err, tkn) {
		callback(err, tkn);
	});
};
/**
 * [updateTknByAxsKey description]
 * @param  {[type]}   axs_key  [description]
 * @param  {[type]}   set      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.updateTknByAxsKey = function(axs_key, set, callback) {
	'use strict';
	tknDao.updateSchema({
		axs_key: axs_key
	}, set, {}, function(err, tkn) {
		callback(err, tkn);
	});
};

/**
 * [findtknByAxsKey description]
 * @param  {[type]}   axs_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findTknByAxsKey = function(axs_key, callback) {
	'use strict';
	tknDao.findAndPopulateSchema({
		'axs_key': axs_key
	}, '_usr_id _app_id', function(err, tkn) {
		callback(err, tkn);
	});
};

/**
 * [findTknByUsrIdAppId description]
 * @param  {[type]}   _usr_id  [description]
 * @param  {[type]}   _app_id  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findTknByUsrIdAppId = function(_usr_id, _app_id, callback) {
	'use strict';
	tknDao.findAndPopulateSchema({
		'_usr_id': _usr_id,
		'_app_id': _app_id
	}, '_usr_id _app_id', function(err, tkn) {
		callback(err, tkn);
	});
};

/**
 * [findAllTkns description]
 * @param  {[type]}   query    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAllTkns = function(query, order, callback) {
	'use strict';
	tknDao.findAndPopulateAllSchemaLst(query, order, '_usr_id _app_id', function(err, tkn) {
		callback(err, tkn);
	});
};

/**
 * [delTkn description]
 * @param  {[type]}   axs_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.delTkn = function(axs_key, callback) {
	'use strict';
	tknDao.delSchema({
		'axs_key': axs_key
	}, function(err, tkn) {
		callback(err, tkn);
	});
};