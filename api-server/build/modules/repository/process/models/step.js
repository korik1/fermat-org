'use strict';
var mongoose = require('mongoose');

/**
 * [StepMdl description]
 *
 * @method StepMdl
 *
 * @param  {[type]}   _proc_id    [description]
 * @param  {[type]}   _comp_id    [description]
 * @param  {[type]}   type        [description]
 * @param  {[type]}   title       [description]
 * @param  {[type]}   desc [description]
 * @param  {[type]}   order       [description]
 * @param  {Function} next        [description]
 */
function StepMdl(_proc_id, _comp_id, type, title, desc, order, next) {
    // always initialize all instance properties
    this._proc_id = _proc_id;
    this._comp_id = _comp_id;
    this.type = type;
    this.title = title;
    this.desc = desc;
    this.order = order;
    this.next = next;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} stepSchema [description]
 *
 * @return {[type]} [description]
 */
StepMdl.prototype.init = function (stepSchema) {
    this._id = stepSchema._id;
    this._proc_id = stepSchema._proc_id;
    this._comp_id = stepSchema._comp_id;
    this.type = stepSchema.type;
    this.title = stepSchema.title;
    this.desc = stepSchema.desc;
    this.order = stepSchema.order;
    this.next = stepSchema.next;
    this.upd_at = stepSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
StepMdl.prototype.setUpdate = function () {
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = StepMdl;