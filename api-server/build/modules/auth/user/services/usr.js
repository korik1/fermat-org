var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var devMod = require('../../../repository/developer');
var UsrMdl = require('../models/usr');
var usrSch = require('../schemas/usr');

/**
 * [usrDao description]
 *
 * @type {Dao}
 */
var usrDao = new Dao('Usr', usrSch, UsrMdl);

/**
 * [insertUsrAndDev description]
 * @param  {[type]}   usr_mdl  [description]
 * @param  {[type]}   dev_mdl  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.insertUsrAndDev = function (usr_mdl, dev_mdl, callback) {
    'use strict';
    usrDao.insertSchema(usr_mdl, function (err, usr) {
        callback(err, usr);
    });
    devMod.insOrUpdDev(dev_mdl.usrnm, dev_mdl.email, dev_mdl.name, dev_mdl.bday, dev_mdl.country,
    dev_mdl.avatar_url, dev_mdl.url, dev_mdl.bio, function (err, dev) {
    	callback(err, dev);
    });
};

/**
 * [findUsrById description]
 * @param  {[type]}   _id      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrById = function (_id, callback) {
    'use strict';
    usrDao.findSchemaById(_id, function (err, usr) {
        callback(err, usr);
    });
};

/**
 * [findUsrByEmail description]
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrByEmail = function (email, callback) {
    'use strict';
    usrDao.findSchema({
        email: email
    }, function (err, usr) {
        callback(err, usr);
    });
};

/**
 * [findUsrByUsrnm description]
 * @param  {[type]}   usrnm    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrByUsrnm = function (usrnm, callback) {
    'use strict';
    usrDao.findSchema({
        usrnm: usrnm
    }, function (err, usr) {
        callback(err, usr);
    });
};

/**
 * [findUsers description]
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrs = function (query, limit, order, callback) {
    'use strict';
    usrDao.findSchemaLst(query, limit, order, function (err, usr) {
        callback(err, usr);
    });
};

/**
 * [findAllUsers description]
 * @param  {[type]}   query    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAllUsrs = function (query, order, callback) {
    'use strict';
    usrDao.findAllSchemaLst(query, order, function (err, usr) {
        callback(err, usr);
    });
};

/**
 * [updateUsrById description]
 * @param  {[type]}   _id      [description]
 * @param  {[type]}   set      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.updateUsrById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    usrDao.updateSchema({
        _id: _id
    }, set, {}, function (err, usr) {
        callback(err, usr);
    });
};

/**
 * [delAllUsers description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.delAllUsrs = function (callback) {
    'use strict';
    usrDao.delAllSchemas(function (err, usr) {
        callback(err, usr);
    });
};