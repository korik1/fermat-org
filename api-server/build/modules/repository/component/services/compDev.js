var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var CompDevMdl = require('../models/compDev');
var compDevSch = require('../schemas/compDev');
var CompMdl = require('../models/comp');
var compSch = require('../schemas/comp');
var DevMdl = require('../../developer/models/dev');
var devSch = require('../../developer/schemas/dev');

/**
 * [compDevDao description]
 *
 * @type {Dao}
 */
var compDevDao = new Dao('CompDev', compDevSch, CompDevMdl, 'Comp', compSch, CompMdl, 'Dev', devSch, DevMdl);

/**
 * [insertCompDev description]
 *
 * @method insertCompDev
 *
 * @param  {[type]}   compDev_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertCompDev = function (compDev_mdl, callback) {
    'use strict';
    compDevDao.insertSchema(compDev_mdl, function (err, compDev) {
        callback(err, compDev);
    });
};

/**
 * [findCompDevById description]
 *
 * @method findCompDevById
 *
 * @param  {[type]}        _id      [description]
 * @param  {Function}      callback [description]
 *
 * @return {[type]}        [description]
 */
exports.findCompDevById = function (_id, callback) {
    'use strict';
    compDevDao.findAndPopulateSchemaById(_id, '_dev_id _comp_id', function (err, compDev) {
        callback(err, compDev);
    });
};

/**
 * [findCompDev description]
 *
 * @method findCompDev
 *
 * @param  {[type]}    query    [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findCompDev = function (query, callback) {
    'use strict';
    compDevDao.findAndPopulateSchema(query, '_dev_id _comp_id', function (err, compDev) {
        callback(err, compDev);
    });
};

/**
 * [findCompDevs description]
 *
 * @method findCompDevs
 *
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findCompDevs = function (query, limit, order, callback) {
    'use strict';
    compDevDao.findAndPopulateSchemaLst(query, limit, order, '_dev_id _comp_id', function (err, compDev) {
        callback(err, compDev);
    });
};

/**
 * [findAllCompDevs description]
 *
 * @method findAllCompDevs
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    order    [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findAllCompDevs = function (query, order, callback) {
    'use strict';
    compDevDao.findAndPopulateAllSchemaLst(query, order, '_dev_id _comp_id', function (err, compDev) {
        callback(err, compDev);
    });
};

/**
 * [updateCompDevById description]
 *
 * @method updateCompDevById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateCompDevById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    compDevDao.updateSchema({
        _id: _id
    }, set, {}, function (err, compDev) {
        callback(err, compDev);
    });
};

/**
 * [delCompDevById description]
 *
 * @method delCompDevById
 *
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.delCompDevById = function (_id, callback) {
    'use strict';
    compDevDao.delSchemaById(_id, function (err, comp) {
        callback(err, comp);
    });
};

/**
 * [delAllCompDevs description]
 *
 * @method delAllCompDevs
 *
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.delAllCompDevs = function (callback) {
    'use strict';
    compDevDao.delAllSchemas(function (err, comp) {
        callback(err, comp);
    });
};