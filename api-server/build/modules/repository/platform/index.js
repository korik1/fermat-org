var platfrmSrv = require('./services/platfrm');
var PlatfrmMdl = require('./models/platfrm');
var compMod = require('../component');
var orderLib = require('../../../lib/utils/order');
/**
 * [sort description]
 *
 * @method sort
 *
 * @param  {[type]} point [description]
 * @param  {[type]} dir   [description]
 *
 * @return {[type]} [description]
 */
var swapOrder = function (action, oldSpot, newSpot, callback) {
    orderLib.swapOrder(action, oldSpot, newSpot, function (err, query, set) {
        if (err) {
            return callback(err, null);
        } else {
            platfrmSrv.updatePlatfrms(query, set, function (err_srt, res_srt) {
                if (err_srt) {
                    return callback(err_srt, null);
                } else {
                    return callback(null, res_srt);
                }
            });
        }
    });
};
/**
 * [insOrUpdPlatfrm description]
 *
 * @method insOrUpdPlatfrm
 *
 * @param  {[type]}        code          [description]
 * @param  {[type]}        name          [description]
 * @param  {[type]}        logo          [description]
 * @param  {[type]}        deps          [description]
 * @param  {[type]}        order         [description]
 * @param  {Function}      callback      [description]
 *
 * @return {[type]}        [description]
 */
exports.insOrUpdPlatfrm = function (code, name, logo, deps, order, callback) {
    'use strict';
    try {
        platfrmSrv.findPlatfrmByCode(code, function (err_plat, res_plat) {
            if (err_plat) {
                return callback(err_plat, null);
            }
            if (res_plat) {
                var set_obj = {};
                if (name && name !== res_plat.name) {
                    set_obj.name = name;
                    res_plat.name = name;
                }
                if (logo && logo !== res_plat.logo) {
                    set_obj.logo = logo;
                    res_plat.logo = logo;
                }
                if (deps && deps !== res_plat.deps) {
                    set_obj.deps = deps;
                    res_plat.deps = deps;
                }
                if (order != -1 && order != res_plat.order) {
                    set_obj.order = order;
                    res_plat.order = order;
                }
                if (Object.keys(set_obj).length > 0) {
                    if (typeof set_obj.order != 'undefined' && set_obj.order > -1) {
                        swapOrder('update', res_plat.order, set_obj.order, function (err_sld, res_sld) {
                            if (err_sld) {
                                return callback(err_sld, null);
                            } else {
                                platfrmSrv.updatePlatfrmById(res_plat._id, set_obj, function (err, plat) {
                                    if (err) {
                                        return callback(err, null);
                                    }
                                    return callback(null, set_obj);
                                });
                            }
                        });
                    } else {
                        platfrmSrv.updatePlatfrmById(res_plat._id, set_obj, function (err_upd, res_upd) {
                            if (err_upd) {
                                return callback(err_upd, null);
                            }
                            return callback(null, set_obj);
                        });
                    }
                } else {
                    return callback(null, res_plat);
                }
            } else {
                var platfrm = new PlatfrmMdl(code, name, logo, deps, order);
                swapOrder('insert', null, platfrm.order, function (err_sld, res_sld) {
                    if (err_sld) {
                        return callback(err_sld, null);
                    } else {
                        platfrmSrv.insertPlatfrm(platfrm, function (err_ins, res_ins) {
                            if (err_ins) {
                                return callback(err_ins, null);
                            }
                            return callback(null, res_ins);
                        });
                    }
                });
            }
        });
    } catch (err) {
        callback(err, null);
    }
};
/**
 * [getPlatfrms description]
 *
 * @method getPlatfrms
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.getPlatfrms = function (callback) {
    'use strict';
    try {
        platfrmSrv.findAllPlatfrms({}, {
            order: 1
        }, function (err, platfrms) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, platfrms);
            }
        });
    } catch (err) {
        callback(err, null);
    }
};
/**
 * [delAllPlatfrms description]
 *
 * @method delAllPlatfrms
 *
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.delAllPlatfrms = function (callback) {
    'use strict';
    try {
        platfrmSrv.delAllPlatfrms(function (err, platfrms) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, true);
        });
    } catch (err) {
        return callback(err, null);
    }
};
/**
 * [findPlatfrmById description]
 *
 * @method findPlatfrmById
 *
 * @param  {[type]}     _id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findPlatfrmById = function (_id, callback) {
    'use strict';
    try {
        platfrmSrv.findPlatfrmById(_id, function (err_plat, res_plat) {
            if (err_plat) {
                return callback(err_plat, null);
            }
            return callback(null, res_plat);
        });
    } catch (err) {
        return callback(err, null);
    }
};
/**
 * [updatePlatfrmById description]
 *
 * @method updatePlatfrmById
 *
 *
 * @param  {[type]}     _platfrm_id         [description]
 * @param  {[type]}     code            [description]
 * @param  {[type]}     name            [description]
 * @param  {[type]}     logo            [description]
 * @param  {[type]}     deps            [description]
 * @param  {[type]}     order           [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.updatePlatfrmById = function (_platfrm_id, code, name, logo, deps, order, callback) {
    'use strict';
    try {
        var set_obj = {};
        if (code) {
            set_obj.code = code;
        }
        if (name) {
            set_obj.name = name;
        }
        if (logo) {
            set_obj.logo = logo;
        }
        if (deps) {
            set_obj.deps = deps;
        }
        if (typeof order != "undefined") {
            set_obj.order = order;
        }
        platfrmSrv.findPlatfrmById(_platfrm_id, function (err_platfrm, res_platfrm) {
            if (err_platfrm) {
                return callback(err_platfrm, null);
            }
            if (typeof set_obj.order != 'undefined' && set_obj.order > -1) {
                swapOrder('update', res_platfrm.order, set_obj.order, function (err_sld, res_sld) {
                    if (err_sld) {
                        return callback(err_sld, null);
                    } else {
                        platfrmSrv.updatePlatfrmById(_platfrm_id, set_obj, function (err, plat) {
                            if (err) {
                                return callback(err, null);
                            }
                            return callback(null, set_obj);
                        });
                    }
                });
            } else {
                platfrmSrv.updatePlatfrmById(_platfrm_id, set_obj, function (err_upd, res_upd) {
                    if (err_upd) {
                        return callback(err_upd, null);
                    }
                    return callback(null, set_obj);
                });
            }
        });
    } catch (err) {
        return callback(err, null);
    }
};
/**
 * [delPlatfrmById description]
 *
 * @method delPlatfrmById
 *
 * @param  {[type]}        _id      [description]
 * @param  {Function}      callback [description]
 *
 * @return {[type]}        [description]
 */
exports.delPlatfrmById = function (_id, callback) {
    'use strict';
    try {
        var delPlatfrm = function () {
            platfrmSrv.findPlatfrmById(_id, function (err_platfrm, res_platfrm) {

                if (err_platfrm) {
                    return callback(err_platfrm, null);
                } else if (res_platfrm){
                    swapOrder('delete', res_platfrm.order, null, function (err_sld, res_sld) {
                        if (err_sld) {
                            return callback(err_sld, null);
                        } else {
                            platfrmSrv.delPlatfrmById(res_platfrm._id, function (err_del, res_del) {
                                if (err_del) {
                                    return callback(err_del, null);
                                }
                                return callback(null, res_platfrm);
                            });
                        }
                    });
                }else{
                    return callback(null, null);

                }
                // ordering function
               
            });
        };
        compMod.findCompsByPlatfrmId(_id, function (err_comp, res_comps) {
            if (err_comp) {
                return callback(err_comp, null);
            }
            if (res_comps.length > 0) {
                var _comps = res_comps;
                var loopDelComps = function () {
                    if (_comps.length <= 0) {
                        delPlatfrm();
                    } else {
                        var comp = _comps.pop();
                        compMod.delCompById(comp._id, function (err_del_comp, res_del_comp) {
                            if (err_del_comp) {
                                return callback(err_del_comp, null);
                            } else {
                                loopDelComps();
                            }
                        });
                    }
                };
                loopDelComps();
            } else {
                delPlatfrm();
            }
        });
    } catch (err) {
        return callback(err, null);
    }
};