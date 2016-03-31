var mongoose = require('mongoose');
/**
 * [LockMdl description]
 *
 * @method LockMdl
 *
 * @param  {[type]} _usr_id   [description]
 * @param  {[type]} _item_id  [description]
 * @param  {[type]} item_type [description]
 * @param  {[type]} priority  [description]
 */
function LockMdl(_usr_id, _item_id, item_type, priority) {
    'use strict';
    // always initialize all instance properties
    this._usr_id = _usr_id;
    this._item_id = _item_id;
    this.item_type = item_type;
    this.priority = priority;
    this.upd_at = new mongoose.Types.ObjectId();
}
/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} lockSchema [description]
 *
 * @return {[type]} [description]
 */
LockMdl.prototype.init = function (lockSchema) {
    'use strict';
    this._id = lockSchema._id;
    this._usr_id = lockSchema._usr_id;
    this._item_id = lockSchema._item_id;
    this.item_type = lockSchema.item_type;
    this.priority = lockSchema.priority;
    this.upd_at = lockSchema.upd_at;
};
/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
LockMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};
// export the class
module.exports = LockMdl;