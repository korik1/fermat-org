var winston = require('winston');
/**
 * [Route description]
 *
 * @method Route
 *
 * @param  {[type]} body   [description]
 * @param  {[type]} date   [description]
 * @param  {[type]} time   [description]
 */
function Route(body, date, time) {
    'use strict';
    this.body = body || {};
    this.date = date || new Date();
    this.time = time || 3600000;
}

/**
 * [isValid description]
 *
 * @method isValid
 *
 * @return {Boolean} [description]
 */
Route.prototype.isValid = function () {
    'use strict';
    var then = new Date(this.date);
    var now = new Date();
    var alive = now.getTime() - then.getTime();
    var rest = alive - this.time;
    var valid = rest < 0;
    winston.log('info', 'Time alive %s', alive);
    winston.log('info', 'Resting time %s', rest);
    winston.log('info', 'Valid %s', valid);
    return valid;
};

module.exports = Route;