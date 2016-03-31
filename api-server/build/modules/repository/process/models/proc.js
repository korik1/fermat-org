'use strict';
var mongoose = require('mongoose');

/**
 * [ProcMdl description]
 *
 * @method ProcMdl
 *
 * @param  {[type]}   platfrm [description]
 * @param  {[type]}   name    [description]
 * @param  {[type]}   desc    [description]
 * @param  {[type]}   prev    [description]
 * @param  {Function} next    [description]
 * @param  {[type]}   steps   [description]
 */
function ProcMdl(platfrm, name, desc, prev, next, steps) {
    // always initialize all instance properties
    this.platfrm = platfrm;
    this.name = name;
    this.desc = desc;
    this.prev = prev;
    this.next = next;
    this.steps = steps;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} procSchema [description]
 *
 * @return {[type]} [description]
 */
ProcMdl.prototype.init = function (procSchema) {
    this._id = procSchema._id;
    this.platfrm = procSchema.platfrm;
    this.name = procSchema.name;
    this.desc = procSchema.desc;
    this.prev = procSchema.prev;
    this.next = procSchema.next;
    this.steps = procSchema.steps;
    this.upd_at = procSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
ProcMdl.prototype.setUpdate = function () {
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = ProcMdl;