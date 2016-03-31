var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var StatusMdl = require('../models/status');
var statusSch = require('../schemas/status');
var CompMdl = require('../models/comp');
var compSch = require('../schemas/comp');

/**
 * [statusDao description]
 *
 * @type {Dao}
 */
var statusDao = new Dao('Status', statusSch, StatusMdl, 'Comp', compSch, CompMdl);

/**
 * [insertStatus description]
 *
 * @method insertStatus
 *
 * @param  {[type]}   status_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertStatus = function (status_mdl, callback) {
    'use strict';
    statusDao.insertSchema(status_mdl, function (err, status) {
        callback(err, status);
    });
};

/**
 * [findStatusById description]
 *
 * @method findStatusById
 *
 * @param  {[type]}    _id      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findStatusById = function (_id, callback) {
    'use strict';
    statusDao.findSchemaById(_id, function (err, status) {
        callback(err, status);
    });
};

/**
 * [findStatus description]
 *
 * @method findStatus
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findStatus = function (query, callback) {
    'use strict';
    statusDao.findAndPopulateSchema(query, '_comp_id', function (err, compDev) {
        callback(err, compDev);
    });
};

/**
 * [findStatuss description]
 *
 * @method findStatuss
 *
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findStatuses = function (query, limit, order, callback) {
    'use strict';
    statusDao.findAndPopulateSchemaLst(query, limit, order, '_comp_id', function (err, status) {
        callback(err, status);
    });
};

/**
 * [findAllStatuss description]
 *
 * @method findAllStatuss
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    order    [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findAllStatuses = function (query, order, callback) {
    'use strict';
    statusDao.findAndPopulateAllSchemaLst(query, order, '_comp_id', function (err, status) {
        callback(err, status);
    });
};

/**
 * [updateStatusById description]
 *
 * @method updateStatusById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateStatusById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    statusDao.updateSchema({
        _id: _id
    }, set, {}, function (err, status) {
        callback(err, status);
    });
};

/**
 * [delAllStatuses description]
 *
 * @method delAllStatuses
 *
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.delAllStatuses = function (callback) {
    'use strict';
    statusDao.delAllSchemas(function (err, comp) {
        callback(err, comp);
    });
};

/**
 * [delStatusById description]
 *
 * @method delStatusById
 *
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.delStatusById = function (_id, callback) {
    'use strict';
    statusDao.delSchemaById(_id, function (err, comp) {
        callback(err, comp);
    });
};