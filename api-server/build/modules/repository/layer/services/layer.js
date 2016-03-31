var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var layerMdl = require('../models/layer');
var layerSch = require('../schemas/layer');
/**
 * [layerDao description]
 *
 * @type {Dao}
 */
var layerDao = new Dao('Layer', layerSch, layerMdl);
/**
 * [insertLayer description]
 *
 * @method insertLayer
 *
 * @param  {[type]}   layer_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertLayer = function (layer_mdl, callback) {
    'use strict';
    layerDao.insertSchema(layer_mdl, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [findLayerById description]
 *
 * @method findLayerById
 *
 * @param  {[type]}    _id      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findLayerById = function (_id, callback) {
    'use strict';
    layerDao.findSchemaById(_id, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [findLayerByCode description]
 *
 * @method findLayerByLang
 *
 * @param  {[type]}       lang    [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.findLayerByLang = function (lang, callback) {
    'use strict';
    layerDao.findSchema({
        lang: lang
    }, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [findLayerByName description]
 *
 * @method findLayerByName
 *
 * @param  {[type]}       name    [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.findLayerByName = function (name, callback) {
    'use strict';
    layerDao.findSchema({
        name: name
    }, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [findLayers description]
 *
 * @method findLayers
 *
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findLayers = function (query, limit, order, callback) {
    'use strict';
    layerDao.findSchemaLst(query, limit, order, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [findAllLayers description]
 *
 * @method findAllLayers
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    order    [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.findAllLayers = function (query, order, callback) {
    'use strict';
    layerDao.findAllSchemaLst(query, order, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [findLayerById description]
 *
 * @method findLayerById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findLayerById = function (_id, callback) {
    'use strict';
    layerDao.findSchemaById(_id, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [updateLayerById description]
 *
 * @method updateLayerById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateLayerById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    layerDao.updateSchema({
        _id: _id
    }, set, {}, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [delAllLayers description]
 *
 * @method delAllLayers
 *
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.delAllLayers = function (callback) {
    'use strict';
    layerDao.delAllSchemas(function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [delLayerById description]
 *
 * @method delLayerById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.delLayerById = function (_id, callback) {
    'use strict';
    layerDao.delSchema({
        _id: _id
    }, function (err, layer) {
        callback(err, layer);
    });
};
/**
 * [updateLayers description]
 *
 * @method updateLayers
 *
 * @param  {[type]}    query    [description]
 * @param  {[type]}    set      [description]
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.updateLayers = function (query, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    layerDao.updateSchema(query, set, {
        multi: true
    }, function (err, layer) {
        callback(err, layer);
    });
};