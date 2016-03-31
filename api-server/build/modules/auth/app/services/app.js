var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var AppMdl = require('../models/app');
var appSch = require('../schemas/app');
var UsrMdl = require('../../user/models/usr');
var usrSch = require('../../user/schemas/usr');
/**
 * [compDao description]
 *
 * @type {Dao}
 */
var appDao = new Dao('App', appSch, AppMdl, 'Usr', usrSch, UsrMdl);

/**
 * Insert app in database
 * @param  {[type]}   app_mdl  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.insApp = function (app_mdl, callback) {
    'use strict';
    appDao.insertSchema(app_mdl, function (err, app) {
        callback(err, app);
    });
};

/**
 * Find app by id
 * @param  {[type]}   _id      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAppById = function (_id, callback) {
    'use strict';
    appDao.findSchemaById(_id, function (err, app) {
        callback(err, app);
    });
};

/**
 * Find app by name
 * @param  {[type]}   name     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAppByApiKey = function (api_key, callback) {
    'use strict';
     appDao.findSchema({
        api_key: api_key
    }, function (err, app) {
        callback(err, app);
    });
};

/**
 * Find apps applying filters
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findApps = function (query, limit, order, callback) {
    'use strict';
    appDao.findSchemaLst(query, limit, order, function (err, app) {
        callback(err, app);
    });
};

/**
 * Find all apps
 * @param  {[type]}   query    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAllApps = function (query, order, callback) {
    'use strict';
    appDao.findAllSchemaLst(query, order, function (err, app) {
        callback(err, app);
    });
};

/**
 * Update app by id
 * @param  {[type]}   _id      [description]
 * @param  {[type]}   set      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.updateAppById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    appDao.updateSchema({
        _id: _id
    }, set, {}, function (err, app) {
        callback(err, app);
    });
};

/**
 * Delete all apps
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.delAllApps = function (callback) {
    'use strict';
    appDao.delAllSchemas(function (err, app) {
        callback(err, app);
    });
};
