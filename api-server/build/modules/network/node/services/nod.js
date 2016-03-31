var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var nodSch = require('../schemas/nod');
var nodMdl = require('../models/nod');

/**
 * [nodDao description]
 *
 * @type {Dao}
 */
var nodDao = new Dao('Nod', nodSch, nodMdl);

/**
 * [insertNod description]
 *
 * @method insertNod
 *
 * @param  {[type]}   nod_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertNod = function (nod_mdl, callback) {
    'use strict';
    nodDao.insertSchema(nod_mdl, function (err, nod) {
        callback(err, nod);
    });
};

/**
 * [findNodById description]
 *
 * @method findNodById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findNodById = function (_id, callback) {
    'use strict';
    nodDao.findSchemaById(_id, function (err, nod) {
        callback(err, nod);
    });
};

/**
 * [findNod description]
 *
 * @method findNod
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findNod = function (query, callback) {
    'use strict';
    nodDao.findSchema(query, function (err, nod) {
        callback(err, nod);
    });
};

/**
 * [findNods description]
 *
 * @method findNods
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findNods = function (query, sort, callback) {
    'use strict';
    nodDao.findAllSchemaLst(query, sort, function (err, nod) {
        callback(err, nod);
    });
};

/**
 * [findAllNods description]
 *
 * @method findAllNods
 *
 * @param  {[type]}    sort     [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findAllNods = function (sort, callback) {
    'use strict';
    nodDao.findAllSchemaLst({}, sort, function (err, nod) {
        callback(err, nod);
    });
};

/**
 * [updateNodById description]
 *
 * @method updateNodById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateNodById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    nodDao.updateSchema({
        _id: _id
    }, set, {}, function (err, nod) {
        callback(err, nod);
    });
};

/**
 * [delAllNods description]
 *
 * @method delAllNods
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delAllNods = function (callback) {
    'use strict';
    nodDao.delAllSchemas(function (err, nod) {
        callback(err, nod);
    });
};

/**
 * [delNodById description]
 *
 * @method delNodById
 *
 * @param  {[type]}   _id      [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.delNodById = function (_id, callback) {
    'use strict';
    nodDao.delSchemaById(_id, function (err, nod) {
        callback(err, nod);
    });
};