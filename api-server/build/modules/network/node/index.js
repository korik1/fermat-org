/*jshint -W069 */
var nodSrv = require('./services/nod');
var NodMdl = require('./models/nod');
var XtraMdl = require('./models/xtra');


exports.findNodsByWaveIdAndType = function (_wave_id, type, callback) {
    'use strict';
    try {
        var find_obj = {};
        find_obj['$and'] = [];
        find_obj['$and'].push({
            '_wave_id': _wave_id
        });
        find_obj['$and'].push({
            'type': type
        });
        nodSrv.findNods(find_obj, {
            _id: 1
        }, function (err, nods) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, nods);
        });
    } catch (err) {
        return callback(err, null);
    }
};

exports.findNodById = function (_id, callback) {
    'use strict';
    try {
        nodSrv.findNodById(_id, function (err, nod) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, nod);
        });
    } catch (err) {
        return callback(err, null);
    }
};

exports.findNodsByWaveIdAndHash = function (_wave_id, hash, callback) {
    'use strict';
    try {
        var find_obj = {};
        find_obj['$and'] = [];
        find_obj['$and'].push({
            '_wave_id': _wave_id
        });
        find_obj['$and'].push({
            'hash': hash
        });
        console.log("en el find");
        console.log(find_obj);
        nodSrv.findNods(find_obj, {
            _id: 1
        }, function (err, nods) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, nods);
        });
    } catch (err) {
        return callback(err, null);
    }
};

/**
 * [insertNod description]
 *
 * @method insertNod
 *
 * @param  {[type]}   _wave_id [description]
 * @param  {[type]}   hash     [description]
 * @param  {[type]}   type     [description]
 * @param  {[type]}   os       [description]
 * @param  {[type]}   sub      [description]
 * @param  {[type]}   curncy   [description]
 * @param  {[type]}   symbl    [description]
 * @param  {[type]}   balnc    [description]
 * @param  {[type]}   status   [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertNod = function (_wave_id, hash, type, os, sub, curncy, symbl, balnc, status, callback) {
    'use strict';
    try {
        var xtra = new XtraMdl(os, sub, curncy, symbl, balnc, status);
        var nod = new NodMdl(_wave_id, hash, type, xtra);
        nodSrv.insertNod(nod, function (err_ins, res_ins) {
            if (err_ins) {
                return callback(err_ins, null);
            }
            return callback(null, res_ins);
        });
    } catch (err) {
        return callback(err, null);
    }
};

/*jshint +W069 */