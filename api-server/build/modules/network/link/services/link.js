var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var linkMdl = require('../models/link');
var linkSch = require('../schemas/link');
var waveMdl = require('../../wave/models/wave');
var waveSch = require('../../wave/schemas/wave');
var nodeMdl = require('../../node/models/nod');
var nodeSch = require('../../node/schemas/nod');



/**
 * [linkDao description]
 *
 * @type {Dao}
 */
var linkDao = new Dao('Link', linkSch, linkMdl, 'Node', nodeSch, nodeMdl,
                      'Wave', waveSch, waveMdl);

/**
 * [insertLink description]
 *
 * @method insertLink
 *
 * @param  {[type]}   link_mdl  [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.insertLink = function (link_mdl, callback) {
    'use strict';
    linkDao.insertSchema(link_mdl, function (err, link) {
        callback(err, link);
    });
};

/**
 * [findLinkById description]
 *
 * @method findLinkById
 *
 * @param  {[type]}     _id      [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.findLinkById = function (_id, callback) {
    'use strict';
    linkDao.findSchemaById(_id, function (err, link) {
        callback(err, link);
    });
};

/**
 * [findAndPopulateLinkById description]
 *
 * @method findAndPopulateLinkById
 *
 * @param  {[type]}                _id      [description]
 * @param  {[type]}                path     [description]
 * @param  {Function}              callback [description]
 *
 * @return {[type]}                [description]
 */
exports.findAndPopulateLinkById = function (_id, path, callback) {
    'use strict';
    linkDao.findAndPopulateSchemaById(_id, path, function (err, link) {
        callback(err, link);
    });
};

/**
 * [findLink description]
 *
 * @method findLink
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findLink = function (query, callback) {
    'use strict';
    linkDao.findSchema(query, function (err, link) {
        callback(err, link);
    });
};

/**
 * [findLinks description]
 *
 * @method findLinks
 *
 * @param  {[type]}   query    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findLinks = function (query, sort, callback) {
    'use strict';
    linkDao.findAllSchemaLst(query, sort, function (err, link) {
        callback(err, link);
    });
};

/**
 * [updateLinkById description]
 *
 * @method updateLinkById
 *
 * @param  {[type]}      _id      [description]
 * @param  {[type]}      set      [description]
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
exports.updateLinkById = function (_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    linkDao.updateSchema({
        _id: _id
    }, set, {}, function (err, link) {
        callback(err, link);
    });
};

/**
 * [delAllLinks description]
 *
 * @method delAllLinks
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delAllLinks = function (callback) {
    'use strict';
    linkDao.delAllSchemas(function (err, link) {
        callback(err, link);
    });
};