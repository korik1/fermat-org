var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var devMdl = require('../models/dev');
var devSch = require('../schemas/dev');

/**
 * [devDao description]
 *
 * @type {Dao}
 */
var devDao = new Dao('Dev', devSch, devMdl);

/**
 * [insertDev description]
 *
 * @method insertDev
 *
 * @param  {[type]}   dev_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertDev = function (dev_mdl, callback) {
    'use strict';
    devDao.insertSchema(dev_mdl, function (err, dev) {
        callback(err, dev);
    });
};

/**
 * [findDevById description]
 *
 * @method findDevById
 *
 * @param  {[type]}    _id      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findDevById = function (_id, callback) {
    'use strict';
    devDao.findSchemaById(_id, function (err, dev) {
        callback(err, dev);
    });
};

/**
 * [findDevByEmail description]
 *
 * @method findDevByEmail
 *
 * @param  {[type]}       email    [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.findDevByEmail = function (email, callback) {
    'use strict';
    devDao.findSchema({
        email: email
    }, function (err, dev) {
        callback(err, dev);
    });
};

/**
 * [findDevByUsrnm description]
 *
 * @method findDevByUsrnm
 *
 * @param  {[type]}       usrnm    [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.findDevByUsrnm = function (usrnm, callback) {
    'use strict';
    devDao.findSchema({
        usrnm: usrnm
    }, function (err, dev) {
        callback(err, dev);
    });
};

/**
 * [findDevs description]
 *
 * @method findDevs
 *
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findDevs = function (query, limit, order, callback) {
    'use strict';
    devDao.findSchemaLst(query, limit, order, function (err, dev) {
        callback(err, dev);
    });
};

/**
 * [findAllDevs description]
 *
 * @method findAllDevs
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    order    [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findAllDevs = function (query, order, callback) {
    'use strict';
    devDao.findAllSchemaLst(query, order, function (err, dev) {
        callback(err, dev);
    });
};

/**
 * [updateDevById description]
 *
 * @method updateDevById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateDevById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    devDao.updateSchema({
        _id: _id
    }, set, {}, function (err, dev) {
        callback(err, dev);
    });
};