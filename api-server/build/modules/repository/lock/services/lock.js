var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var lockMdl = require('../models/lock');
var lockSch = require('../schemas/lock');
var usrMdl = require('../../../auth/user/models/usr');
var usrSch = require('../../../auth/user/schemas/usr');
/**
 * [lockDao description]
 *
 * @type {Dao}
 */
var lockDao = new Dao('Lock', lockSch, lockMdl, 'Usr', usrSch, usrMdl);
/**
 * [insertLock description]
 *
 * @method insertLock
 *
 * @param  {[type]}   lock_mdl [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertLock = function (lock_mdl, callback) {
	'use strict';
	lockDao.insertSchema(lock_mdl, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [findLockById description]
 *
 * @method findLockById
 *
 * @param  {[type]}    _id      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findLockById = function (_id, callback) {
	'use strict';
	lockDao.findSchemaById(_id, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [findLockByUsrIdAndItemId description]
 *
 * @method findLockByUsrIdAndItemId
 *
 * @param  {[type]}                 _usr_id  [description]
 * @param  {[type]}                 _item_id [description]
 * @param  {Function}               callback [description]
 *
 * @return {[type]}                 [description]
 */
exports.findLockByUsrIdAndItemId = function (_usr_id, _item_id, callback) {
	'use strict';
	lockDao.findSchema({
		'$and': [{
			'_item_id': _item_id
			}, {
			'_usr_id': _usr_id
			}]
	}, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [findLockByName description]
 *
 * @method findLockByName
 *
 * @param  {[type]}       _item_id    [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.findLockByItemId = function (_item_id, callback) {
	'use strict';
	lockDao.findSchema({
		_item_id: _item_id
	}, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [findLocks description]
 *
 * @method findLocks
 *
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findLocks = function (query, limit, order, callback) {
	'use strict';
	lockDao.findSchemaLst(query, limit, order, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [findAllLocks description]
 *
 * @method findAllLocks
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    order    [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findAllLocks = function (query, order, callback) {
	'use strict';
	lockDao.findAllSchemaLst(query, order, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [findLockById description]
 *
 * @method findLockById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findLockById = function (_id, callback) {
	'use strict';
	lockDao.findSchemaById(_id, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [updateLockById description]
 *
 * @method updateLockById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateLockById = function (_id, set, callback) {
	'use strict';
	set.upd_at = new mongoose.Types.ObjectId();
	lockDao.updateSchema({
		_id: _id
	}, set, {}, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [delLockByUsrIdAndItemId description]
 *
 * @method delLockByUsrIdAndItemId
 *
 * @param  {[type]}                _usr_id  [description]
 * @param  {[type]}                _item_id [description]
 * @param  {Function}              callback [description]
 *
 * @return {[type]}                [description]
 */
exports.delLockByUsrIdAndItemId = function (_usr_id, _item_id, callback) {
	'use strict';
	lockDao.delSchema({
		'$and': [{
			'_item_id': _item_id
			}, {
			'_usr_id': _usr_id
			}]
	}, function (err, lock) {
		callback(err, lock);
	});
};
/**
 * [delLockById description]
 *
 * @method delLockById
 *
 * @param  {[type]}    _id      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delLockById = function (_id, callback) {
	'use strict';
	lockDao.delSchemaById(_id, function (err, lock) {
		callback(err, lock);
	});
};