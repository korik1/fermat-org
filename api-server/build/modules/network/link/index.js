/*jshint -W069 */
var linkSrv = require('./services/link');
var LinkMdl = require('./models/link');

/**
 * [insertLink description]
 *
 * @method insertLink
 *
 * @param  {[type]}   _wave_id          [description]
 * @param  {[type]}   _chld_nod_id      [description]
 * @param  {[type]}   _prnt_nod_id      [description]
 * @param  {[type]}   type              [description]
 * @param  {Function} callback          [description]
 *
 * @return {[type]}   [description]
 */
exports.insertLink = function (_wave_id, _chld_nod_id, _prnt_nod_id, type, callback) {
    'use strict';
    try {
        var link = new LinkMdl(_wave_id, _chld_nod_id, _prnt_nod_id, type);
        linkSrv.insertLink(link, function (err_ins, res_ins) {
            if (err_ins) {
                return callback(err_ins, null);
            }
            return callback(null, res_ins);
        });
    } catch (err) {
        return callback(err, null);
    }
};


/**
 * [findChildrenByType description]
 *
 * @method findChildrenByType
 *
 * @param  {[type]}         _wave_id     [description]
 * @param  {[type]}         _prnt_nod_id [description]
 * @param  {[type]}         type         [description]
 * @param  {Function}       callback     [description]
 *
 * @return {[type]}         [description]
 */
exports.findChildrenByType = function (_wave_id, _prnt_nod_id, type, callback) {
    'use strict';
    try {
        var find_obj = {
            '$and': []
        };
        if (_wave_id) {
            find_obj['$and'].push({
                '_wave_id': _wave_id
            });
        }
        if (_prnt_nod_id) {
            find_obj['$and'].push({
                '_prnt_nod_id': _prnt_nod_id
            });
        }
        if (type) {
            find_obj['$and'].push({
                'type': type
            });
        }
        linkSrv.findLinks(find_obj, { upd_at: -1 }, function (err, links) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, links);
        });
    } catch (err) {
        return callback(err, null);
    }
};

/**
 * [findParentsByType description]
 *
 * @method findParentsByType
 *
 * @param  {[type]}         _wave_id     [description]
 * @param  {[type]}         _chld_nod_id [description]
 * @param  {[type]}         type         [description]
 * @param  {Function}       callback     [description]
 *
 * @return {[type]}         [description]
 */
exports.findParentsByType = function (_wave_id, _chld_nod_id, type, callback) {
    'use strict';
    try {
        var find_obj = {
            '$and': []
        };
        if (_wave_id) {
            find_obj['$and'].push({
                '_wave_id': _wave_id
            });
        }
        if (_chld_nod_id) {
            find_obj['$and'].push({
                '_chld_nod_id': _chld_nod_id
            });
        }
        if (type) {
            find_obj['$and'].push({
                'type': type
            });
        }
        linkSrv.findLinks(find_obj, { upd_at: -1 }, function (err, links) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, links);
        });
    } catch (err) {
        return callback(err, null);
    }
};

/**
 * [findChildren description]
 *
 * @method findChildren
 *
 * @param  {[type]}         _wave_id     [description]
 * @param  {[type]}         _prnt_nod_id [description]
 * @param  {[type]}         type         [description]
 * @param  {Function}       callback     [description]
 *
 * @return {[type]}         [description]
 */
exports.findChildren = function (_wave_id, _prnt_nod_id, callback) {
    'use strict';
    try {
        var find_obj = {
            '$and': []
        };
        if (_wave_id) {
            find_obj['$and'].push({
                '_wave_id': _wave_id
            });
        }
        if (_prnt_nod_id) {
            find_obj['$and'].push({
                '_prnt_nod_id': _prnt_nod_id
            });
        }
        linkSrv.findLinks(find_obj, { upd_at: -1 }, function (err, links) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, links);
        });
    } catch (err) {
        return callback(err, null);
    }
};

/**
 * [findParents description]
 *
 * @method findParents
 *
 * @param  {[type]}         _wave_id     [description]
 * @param  {[type]}         _chld_nod_id [description]
 * @param  {[type]}         type         [description]
 * @param  {Function}       callback     [description]
 *
 * @return {[type]}         [description]
 */
exports.findParents = function (_wave_id, _chld_nod_id, type, callback) {
    'use strict';
    try {
        var find_obj = {
            '$and': []
        };
        if (_wave_id) {
            find_obj['$and'].push({
                '_wave_id': _wave_id
            });
        }
        if (_chld_nod_id) {
            find_obj['$and'].push({
                '_chld_nod_id': _chld_nod_id
            });
        }
        if (type) {
            find_obj['$and'].push({
                'type': type
            });
        }
        linkSrv.findLinks(find_obj, { upd_at: -1 }, function (err, links) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, links);
        });
    } catch (err) {
        return callback(err, null);
    }
};

/*jshint +W069 */