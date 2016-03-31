var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var waveMdl = require('../models/wave');
var waveSch = require('../schemas/wave');



/**
 * [waveDao description]
 *
 * @type {Dao}
 */
var waveDao = new Dao('Wave', waveSch, waveMdl);

/**
 * [insertWave description]
 *
 * @method insertWave
 *
 * @param  {[type]}   wave_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertWave = function (wave_mdl, callback) {
    'use strict';
    waveDao.insertSchema(wave_mdl, function (err, wave) {
        callback(err, wave);
    });
};

/**
 * [findWaveById description]
 *
 * @method findWaveById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findWaveById = function (_id, callback) {
    'use strict';
    waveDao.findSchemaById(_id, function (err, wave) {
        callback(err, wave);
    });
};


/**
 * [findWave description]
 *
 * @method findWave
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findWave = function (query, callback) {
    'use strict';
    waveDao.findSchema(query, function (err, wave) {
        callback(err, wave);
    });
};

/**
 * [findWaves description]
 *
 * @method findWaves
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findWaves = function (query, sort, callback) {
    'use strict';
    waveDao.findAllSchemaLst(query, sort, function (err, wave) {
        callback(err, wave);
    });
};

/**
 * [updateWaveById description]
 *
 * @method updateWaveById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateWaveById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    waveDao.updateSchema({
        _id: _id
    }, set, {}, function (err, wave) {
        callback(err, wave);
    });
};

/**
 * [delAllWaves description]
 *
 * @method delAllWaves
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delAllWaves = function (callback) {
    'use strict';
    waveDao.delAllSchemas(function (err, wave) {
        callback(err, wave);
    });
};