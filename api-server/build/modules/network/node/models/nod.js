var mongoose = require('mongoose');

/**
 * [NodMdl description]
 *
 * @method NodMdl
 *
 * @param  {[type]} _wave_id [description]
 * @param  {[type]} hash     [description]
 * @param  {[type]} type     [description]
 * @param  {[type]} extra    [description]
 */
function NodMdl(_wave_id, hash, type, extra) {
    'use strict';
    // always initialize all instance properties
    this._wave_id = _wave_id;
    this.hash = hash;
    this.type = type;
    this.extra = extra;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} nodSchema [description]
 *
 * @return {[type]} [description]
 */
NodMdl.prototype.init = function (nodSchema) {
    'use strict';
    this._id = nodSchema._id;
    this._wave_id = nodSchema._wave_id;
    this.hash = nodSchema.hash;
    this.type = nodSchema.type;
    this.extra = nodSchema.extra;
    this.upd_at = nodSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
NodMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = NodMdl;