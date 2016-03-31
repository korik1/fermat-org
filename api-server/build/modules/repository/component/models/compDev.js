var mongoose = require('mongoose');

/**
 * [CompDevMdl description]
 *
 * @method CompDevMdl
 *
 * @param  {[type]}   _dev_id  [description]
 * @param  {[type]}   _comp_id [description]
 * @param  {[type]}   role     [description]
 * @param  {[type]}   scope    [description]
 * @param  {[type]}   percnt   [description]
 */
function CompDevMdl(_comp_id, _dev_id, role, scope, percnt) {
    'use strict';
    // always initialize all instance properties
    this._comp_id = _comp_id;
    this._dev_id = _dev_id;
    this.role = role;
    this.scope = scope;
    this.percnt = percnt;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} compDevSchema [description]
 *
 * @return {[type]} [description]
 */
CompDevMdl.prototype.init = function (compDevSchema) {
    'use strict';
    this._id = compDevSchema._id;
    this._comp_id = compDevSchema._comp_id;
    this._dev_id = compDevSchema._dev_id;
    this.role = compDevSchema.role;
    this.scope = compDevSchema.scope;
    this.percnt = compDevSchema.percnt;
    this.upd_at = compDevSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
CompDevMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = CompDevMdl;