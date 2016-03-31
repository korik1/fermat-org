var mongoose = require('mongoose');

/**
 * [LinkMdl constructor]
 *
 * @method LinkMdl
 *
 * @param  {[type]} _wave_id       [description]
 * @param  {[type]} _chld_nod_id   [description]
 * @param  {[type]} _prnt_nod_id   [description]
 * @param  {[type]} type           [description]
 */
function LinkMdl(_wave_id, _chld_nod_id, _prnt_nod_id, type) {
    'use strict';
    // always initialize all instance properties
    this._wave_id = _wave_id;
    this._chld_nod_id = _chld_nod_id;
    this._prnt_nod_id = _prnt_nod_id;
    this.type = type;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} linkSchema [description]
 *
 * @return {[type]} [description]
 */
LinkMdl.prototype.init = function (linkSchema) {
    'use strict';
    this._id = linkSchema._id;
    this._wave_id = linkSchema._wave_id;
    this._chld_nod_id = linkSchema._chld_nod_id;
    this._prnt_nod_id = linkSchema._prnt_nod_id;
    this.type = linkSchema.type;
    this.upd_at = linkSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
LinkMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = LinkMdl;