var devSrv = require('./services/dev');
var DevMdl = require('./models/dev');

/**
 * [insOrUpdDev description]
 *
 * @method insOrUpdDev
 *
 * @param  {[type]}    usrnm      [description]
 * @param  {[type]}    email      [description]
 * @param  {[type]}    name       [description]
 * @param  {[type]}    bday       [description]
 * @param  {[type]}    location    [description]
 * @param  {[type]}    avatar_url [description]
 * @param  {[type]}    url        [description]
 * @param  {[type]}    bio        [description]
 * @param  {Function}  callback   [description]
 *
 * @return {[type]}    [description]
 */
exports.insOrUpdDev = function (usrnm, email, name, bday, location, avatar_url, url, bio, callback) {
    'use strict';
    try {
        devSrv.findDevByUsrnm(usrnm, function (err_dev, res_dev) {
            if (err_dev) {
                return callback(err_dev, null);
            }
            if (res_dev) {
                var set_obj = {};
                if (email && email !== res_dev.email) {
                    set_obj.email = email;
                    res_dev.email = email;
                }
                if (name && name !== res_dev.name) {
                    set_obj.name = name;
                    res_dev.name = name;
                }
                if (bday && bday !== res_dev.bday) {
                    set_obj.bday = bday;
                    res_dev.bday = bday;
                }
                if (location && location !== res_dev.location) {
                    set_obj.location = location;
                    res_dev.location = location;
                }
                if (avatar_url && avatar_url !== res_dev.avatar_url) {
                    set_obj.avatar_url = avatar_url;
                    res_dev.avatar_url = avatar_url;
                }
                if (url && url !== res_dev.url) {
                    set_obj.url = url;
                    res_dev.url = url;
                }
                if (bio && bio !== res_dev.bio) {
                    set_obj.bio = bio;
                    res_dev.bio = bio;
                }
                if (Object.keys(set_obj).length > 0) {
                    devSrv.updateDevById(res_dev._id, set_obj, function (err_upd, res_upd) {
                        if (err_upd) {
                            return callback(err_upd, null);
                        }
                        return callback(null, res_dev);
                    });
                } else {
                    return callback(null, res_dev);
                }
            } else {
                var dev = new DevMdl(usrnm, email, name, bday, location, avatar_url, url, bio);
                devSrv.insertDev(dev, function (err_ins, res_ins) {
                    if (err_ins) {
                        return callback(err_ins, null);
                    }
                    return callback(null, res_ins);
                });
            }
        });
    } catch (err) {
        return callback(err, null);
    }
};

/**
 * [getDevs description]
 *
 * @method getDevs
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getDevs = function (callback) {
    'use strict';
    try {
        devSrv.findAllDevs({}, {}, function (err, devs) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, devs);
        });
    } catch (err) {
        return callback(err, null);
    }
};