var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var stepMdl = require('../models/step');
var stepSch = require('../schemas/step');
var procMdl = require('../models/proc');
var procSch = require('../schemas/proc');
var compMdl = require('../../component/models/comp');
var compSch = require('../../component/schemas/comp');
var compSrv = require('../../component/services/comp');
/**
 * [stepDao description]
 *
 * @type {Dao}
 */
var stepDao = new Dao('Step', stepSch, stepMdl, 'Proc', procSch, procMdl, 'Comp', compSch, compMdl);
/**
 * [insertStep description]
 *
 * @method insertStep
 *
 * @param  {[type]}   step_mdl [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertStep = function (step_mdl, callback) {
	'use strict';
	stepDao.insertSchema(step_mdl, function (err, step) {
		callback(err, step);
	});
};
/**
 * [findStepById description]
 *
 * @method findStepById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findStepById = function (_id, callback) {
	'use strict';
	stepDao.findSchemaById(_id, function (err, step) {
		callback(err, step);
	});
};
/**
 * [findStep description]
 *
 * @method findStep
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findStep = function (query, callback) {
	'use strict';
	stepDao.findSchema(query, function (err, step) {
		callback(err, step);
	});
};
/**
 * [findSteps description]
 *
 * @method findSteps
 *
 * @param  {[type]}   query    [description]
 * @param  {[type]}   sort     [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findSteps = function (query, sort, callback) {
	'use strict';
	stepDao.findAllSchemaLst(query, sort, function (err, step) {
		callback(err, step);
	});
};
/**
 * [findAllSteps description]
 *
 * @method findAllSteps
 *
 * @param  {[type]}     query    [description]
 * @param  {[type]}     order    [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findAllSteps = function (query, order, callback) {
	'use strict';
	stepDao.findAllSchemaLst(query, order, function (err, steps) {
		if (err) {
			callback(err, null);
		} else {
			var _steps = [];
			var loopSteps = function (i) {
				if (i < steps.length) {
					var _step = steps[i];
					compSrv.findAndPopulateCompById(_step._comp_id, '_platfrm_id _suprlay_id _layer_id', function (err, comp) {
						if (err) {
							loopSteps(++i);
						} else {
							_step.comp = comp;
							_steps.push(_step);
							loopSteps(++i);
						}
					});
				} else {
					callback(null, _steps);
				}
			};
			loopSteps(0);
		}
	});
};
/**
 * [updateStepById description]
 *
 * @method updateStepById
 *
 * @param  {[type]}       _id      [description]
 * @param  {[type]}       set      [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.updateStepById = function (_id, set, callback) {
	'use strict';
	set.upd_at = new mongoose.Types.ObjectId();
	stepDao.updateSchema({
		_id: _id
	}, set, {}, function (err, step) {
		callback(err, step);
	});
};
/**
 * [findAndPopulateAllSteps description]
 *
 * @method findAndPopulateAllSteps
 *
 * @param  {[type]}                query    [description]
 * @param  {[type]}                sort     [description]
 * @param  {[type]}                path     [description]
 * @param  {Function}              callback [description]
 *
 * @return {[type]}                [description]
 */
exports.findAndPopulateAllSteps = function (query, sort, path, callback) {
	'use strict';
	stepDao.findAndPopulateAllSchemaLst(query, sort, path, function (err, step) {
		callback(err, step);
	});
};
/**
 * [delAllSteps description]
 *
 * @method delAllSteps
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delAllSteps = function (callback) {
	'use strict';
	stepDao.delAllSchemas(function (err, step) {
		callback(err, step);
	});
};
/**
 * [delStepById description]
 *
 * @method delStepById
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delStepById = function (_id, callback) {
	'use strict';
	stepDao.delSchemaById(_id, function (err, step) {
		callback(err, step);
	});
};
/**
 * [updateSteps description]
 *
 * @method updateSteps
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    set      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.updateSteps = function (query, set, callback) {
	'use strict';
	set.upd_at = new mongoose.Types.ObjectId();
	stepDao.updateSchema(query, set, {
		multi: true
	}, function (err, step) {
		callback(err, step);
	});
};