var validator = require('validator');
/**
 * [isValidData description]
 *
 * @method isValidData
 *
 * @param  {[type]}    data [description]
 *
 * @return {Boolean}   [description]
 */
var isValidData = function (data) {
    if (typeof data == 'undefined' || data === null || data === '' || data === "" || data.length === 0) {
        return false;
    } else return true;
};
/**
 * [isObjectID description]
 *
 * @method isObjectID
 *
 * @param  {[type]}   _obj_id [description]
 *
 * @return {Boolean}  [description]
 */
var isObjectID = function (_obj_id) {
    var str = _obj_id + '';
    if (isValidData(str)) {
        str = str + '';
        if (validator.isAlphanumeric(str)) {
            var len = str.length;
            var valid = false;
            if (len == 12 || len == 24) {
                valid = /^[0-9a-fA-F]+$/.test(str);
            }
            return valid;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
/**
 * [getObjIdToMilis description]
 *
 * @method getObjIdToMilis
 *
 * @param  {[type]}        _obj_id [description]
 *
 * @return {[type]}        [description]
 */
var getObjIdToMilis = function (_obj_id) {
    if (isObjectID(_obj_id)) {
        var timestamp = _obj_id.getTimestamp();
        var date = new Date(timestamp);
        var milisec = date.getTime();
        return milisec;
    }
    return -1;
};
/**
 * [getNow description]
 *
 * @method getNow
 *
 * @return {[type]} [description]
 */
var getNow = function () {
    var date = new Date();
    return date.getTime();
};
/**
 * [isDiffGr description]
 *
 * @method isDiffGr
 *
 * @param  {[type]} _obj_id [description]
 * @param  {[type]} diff    [description]
 *
 * @return {Boolean} [description]
 */
exports.isDiffGr = function (_obj_id, lapse) {
    var then = getObjIdToMilis(_obj_id);
    if (then > -1) {
        var diff = getNow() - then;
        if (diff > lapse) {
            return true;
        }
        return false;
    }
    return false;
};