var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var suprlayMdl = require('../models/suprlay');
var suprlaySch = require('../schemas/suprlay');
/**
 * [suprlayDao description]
 *
 * @type {Dao}
 */
var suprlayDao = new Dao('Suprlay', suprlaySch, suprlayMdl);
/**
 * [insertSuprlay description]
 *
 * @method insertSuprlay
 *
 * @param  {[type]}   suprlay_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertSuprlay = function (suprlay_mdl, callback) {
    'use strict';
    suprlayDao.insertSchema(suprlay_mdl, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [findSuprlayById description]
 *
 * @method findSuprlayById
 *
 * @param  {[type]}    _id      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findSuprlayById = function (_id, callback) {
    'use strict';
    suprlayDao.findSchemaById(_id, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [findSuprlayByCode description]
 *
 * @method findSuprlayByCode
 *
 * @param  {[type]}       code    [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.findSuprlayByCode = function (code, callback) {
    'use strict';
    suprlayDao.findSchema({
        code: code
    }, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [findSuprlayByName description]
 *
 * @method findSuprlayByName
 *
 * @param  {[type]}       name    [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.findSuprlayByName = function (name, callback) {
    'use strict';
    suprlayDao.findSchema({
        name: name
    }, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [findSuprlays description]
 *
 * @method findSuprlays
 *
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findSuprlays = function (query, limit, order, callback) {
    'use strict';
    suprlayDao.findSchemaLst(query, limit, order, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [findAllSuprlays description]
 *
 * @method findAllSuprlays
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    order    [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findAllSuprlays = function (query, order, callback) {
    'use strict';
    suprlayDao.findAllSchemaLst(query, order, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [updateSuprlayById description]
 *
 * @method updateSuprlayById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateSuprlayById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    suprlayDao.updateSchema({
        _id: _id
    }, set, {}, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [delSuprlayById description]
 *
 * @method delSuprlayById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.delSuprlayById = function (_id, callback) {
    'use strict';
    suprlayDao.delSchema({
        _id: _id
    }, function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [delAllSuprlays description]
 *
 * @method delAllSuprlays
 *
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.delAllSuprlays = function (callback) {
    'use strict';
    suprlayDao.delAllSchemas(function (err, suprlay) {
        callback(err, suprlay);
    });
};
/**
 * [updateSuprlays description]
 *
 * @method updateSuprlays
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    set      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.updateSuprlays = function (query, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    suprlayDao.updateSchema(query, set, {
        multi: true
    }, function (err, suprlay) {
        callback(err, suprlay);
    });
};