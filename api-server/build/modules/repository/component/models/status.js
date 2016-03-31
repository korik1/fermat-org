var mongoose = require('mongoose');

/**
 * [StatusMdl description]
 *
 * @method StatusMdl
 *
 * @param  {[type]}  _comp_id [description]
 * @param  {[type]}  name     [description]
 * @param  {[type]}  target   [description]
 * @param  {[type]}  reached  [description]
 */
function StatusMdl(_comp_id, name, target, reached) {
    'use strict';
    // always initialize all instance properties
    this._comp_id = _comp_id;
    this.name = name;
    this.target = target ? new Date(target) : null;
    this.reached = reached ? new Date(reached) : null;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} statusSchema [description]
 *
 * @return {[type]} [description]
 */
StatusMdl.prototype.init = function (statusSchema) {
    'use strict';
    this._id = statusSchema._id;
    this._comp_id = statusSchema._comp_id;
    this.name = statusSchema.name;
    this.target = statusSchema.target;
    this.reached = statusSchema.reached;
    this.upd_at = statusSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
StatusMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

/**
 * [setTarget description]
 *
 * @method setTarget
 *
 * @param  {[type]}  target [description]
 */
StatusMdl.prototype.setTarget = function (target) {
    'use strict';
    this.target = target ? new Date(target) : null;
    this.upd_at = new mongoose.Types.ObjectId();
};

/**
 * [setReached description]
 *
 * @method setReached
 *
 * @param  {[type]}   reached [description]
 */
StatusMdl.prototype.setReached = function (reached) {
    'use strict';
    this.reached = reached ? new Date(reached) : null;
    this.upd_at = new mongoose.Types.ObjectId();
};

/**
 * [getAge description]
 *
 * @method getAge
 *
 * @return {[type]} [description]
 */
StatusMdl.prototype.getAge = function () {
    'use strict';
    var diff = new Date() - this.bday;
    var diffdays = diff / 1000 / (60 * 60 * 24);
    var age = Math.floor(diffdays / 365.25);
    return age;
};

// export the class
module.exports = StatusMdl;