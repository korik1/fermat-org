var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var devSrv = require('../../developer/services/dev');
var compMdl = require('../models/comp');
var compSch = require('../schemas/comp');
var statusMdl = require('../models/status');
var statusSch = require('../schemas/status');
var CompDevMdl = require('../models/compDev');
var compDevSch = require('../schemas/compDev');
var PlatfrmMdl = require('../../platform/models/platfrm');
var platfrmSch = require('../../platform/schemas/platfrm');
var SuprlayMdl = require('../../superlayer/models/suprlay');
var suprlaySch = require('../../superlayer/schemas/suprlay');
var LayerMdl = require('../../layer/models/layer');
var layerSch = require('../../layer/schemas/layer');
/**
 * [compDao description]
 *
 * @type {Dao}
 */
var compDao = new Dao('Comp', compSch, compMdl, 'CompDev', compDevSch, CompDevMdl, 'Platfrm', platfrmSch, PlatfrmMdl, 'Suprlay', suprlaySch, SuprlayMdl, 'Layer', layerSch, LayerMdl, 'Status', statusSch, statusMdl);
/**
 * [insertComp description]
 *
 * @method insertComp
 *
 * @param  {[type]}   comp_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertComp = function (comp_mdl, callback) {
	'use strict';
	compDao.insertSchema(comp_mdl, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [findCompById description]
 *
 * @method findCompById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findCompById = function (_id, callback) {
	'use strict';
	compDao.findSchemaById(_id, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [findAndPopulateCompById description]
 *
 * @method findAndPopulateCompById
 *
 * @param  {[type]}                _id      [description]
 * @param  {[type]}                path     [description]
 * @param  {Function}              callback [description]
 *
 * @return {[type]}                [description]
 */
exports.findAndPopulateCompById = function (_id, path, callback) {
	'use strict';
	compDao.findAndPopulateSchemaById(_id, path, function (err, comp) {
		if (err) {
			callback(err, null);
		} else if (comp) {
			var _compDevs = comp.devs;
			if (_compDevs.length > 0) {
				var _devs = [];
				var loopCompDevs = function (j) {
					if (j < _compDevs.length) {
						var _compDev = {};
						devSrv.findDevById(_compDevs[j]._dev_id, function (err_dev, res_dev) {
							if (err_dev) {
								loopCompDevs(++j);
							} else {
								_compDev.dev = res_dev;
								_compDev._id = _compDevs[j]._id;
								_compDev.role = _compDevs[j].role;
								_compDev.scope = _compDevs[j].scope;
								_compDev.percnt = _compDevs[j].percnt;
								_compDev.upd_at = _compDevs[j].upd_at;
								_devs.push(_compDev);
								loopCompDevs(++j);
							}
						});
					} else {
						comp.devs = _devs;
						callback(null, comp);
					}
				};
				loopCompDevs(0);
			} else {
				callback(null, comp);
			}
		} else {
			callback(null, null);
		}
	});
};
/**
 * [findComp description]
 *
 * @method findComp
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findComp = function (query, callback) {
	'use strict';
	compDao.findSchema(query, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [findComps description]
 *
 * @method findComps
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findComps = function (query, sort, callback) {
	'use strict';
	compDao.findAllSchemaLst(query, sort, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [findAllComps description]
 *
 * @method findAllComps
 *
 * @param  {[type]}     query    [description]
 * @param  {[type]}     order    [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findAllComps = function (query, order, callback) {
	'use strict';
	compDao.findAndPopulateAllSchemaLst(query, order, 'life_cycle devs', function (err, comps) {
		if (err) {
			callback(err, null);
		} else {
			var _comps = [];
			var loopComps = function (i) {
				if (i < comps.length) {
					var _comp = comps[i];
					var _compDevs = _comp.devs;
					//var _lifeCycle = _comp.life_cycle;
					var _devs = [];
					var loopCompDevs = function (j) {
						if (j < _compDevs.length) {
							var _compDev = {};
							devSrv.findDevById(_compDevs[j]._dev_id, function (err_dev, res_dev) {
								if (err_dev) {
									loopCompDevs(++j);
								} else {
									_compDev.dev = res_dev;
									_compDev._id = _compDevs[j]._id;
									_compDev.role = _compDevs[j].role;
									_compDev.scope = _compDevs[j].scope;
									_compDev.percnt = _compDevs[j].percnt;
									_compDev.upd_at = _compDevs[j].upd_at;
									_devs.push(_compDev);
									loopCompDevs(++j);
								}
							});
						} else {
							_comp.devs = _devs;
							_comps.push(_comp);
							loopComps(++i);
						}
					};
					loopCompDevs(0);
				} else {
					callback(null, _comps);
				}
			};
			loopComps(0);
		}
	});
};
/**
 * [updateCompById description]
 *
 * @method updateCompById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateCompById = function (_id, set, callback) {
	'use strict';
	set.upd_at = new mongoose.Types.ObjectId();
	compDao.updateSchema({
		_id: _id
	}, set, {}, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [pushDevToCompById description]
 *
 * @method pushDevToCompById
 *
 * @param  {[type]}          _id         [description]
 * @param  {[type]}          _compDev_id [description]
 * @param  {Function}        callback    [description]
 *
 * @return {[type]}          [description]
 */
exports.pushDevToCompById = function (_id, _compDev_id, callback) {
	'use strict';
	//var compDev_mdl = new CompDevMdl();
	compDao.pushToArray({
		_id: _id
	}, 'devs', _compDev_id, {
		multi: false
	}, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [pushDevToCompById description]
 *
 * @method pushDevToCompById
 *
 * @param  {[type]}          _id         [description]
 * @param  {[type]}          _compDev_id [description]
 * @param  {Function}        callback    [description]
 *
 * @return {[type]}          [description]
 */
exports.pullDevFromCompById = function (_id, _compDev_id, callback) {
	'use strict';
	compDao.pullFromArray({
		_id: _id
	}, 'devs', _compDev_id, {
		multi: false
	}, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [pushLifeCycleToCompById description]
 *
 * @method pushLifeCycleToCompById
 *
 * @param  {[type]}                _id        [description]
 * @param  {[type]}                _status_id [description]
 * @param  {Function}              callback   [description]
 *
 * @return {[type]}                [description]
 */
exports.pushStatusToCompLifeCycleById = function (_id, _status_id, callback) {
	'use strict';
	//var compDev_mdl = new CompDevMdl();
	compDao.pushToArray({
		_id: _id
	}, 'life_cycle', _status_id, {
		multi: false
	}, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [pullLifeCycleFromCompById description]
 *
 * @method pullLifeCycleFromCompById
 *
 * @param  {[type]}                  _id        [description]
 * @param  {[type]}                  _status_id [description]
 * @param  {Function}                callback   [description]
 *
 * @return {[type]}                  [description]
 */
exports.pullStatusFromCompLifeCycleById = function (_id, _status_id, callback) {
	'use strict';
	compDao.pullFromArray({
		_id: _id
	}, 'life_cycle', _status_id, {
		multi: false
	}, function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [delAllComps description]
 *
 * @method delAllComps
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delAllComps = function (callback) {
	'use strict';
	compDao.delAllSchemas(function (err, comp) {
		callback(err, comp);
	});
};
/**
 * [delCompById description]
 *
 * @method delCompById
 *
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.delCompById = function (_id, callback) {
	'use strict';
	compDao.delSchemaById(_id, function (err, comp) {
		callback(err, comp);
	});
};