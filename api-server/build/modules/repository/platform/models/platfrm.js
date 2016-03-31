var mongoose = require('mongoose');

/**
 * [PlatfrmMdl description]
 *
 * @method PlatfrmMdl
 *
 * @param  {[type]}   code          [description]
 * @param  {[type]}   name          [description]
 * @param  {[type]}   logo          [description]
 * @param  {[type]}   deps          [description]
 * @param  {[type]}   order         [description]
 */
function PlatfrmMdl(code, name, logo, deps, order) {
    'use strict';
    // always initialize all instance properties
    this.code = code;
    this.name = name;
    this.logo = logo;
    this.deps = deps;
    this.order = order;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} platfrmSchema [description]
 *
 * @return {[type]} [description]
 */
PlatfrmMdl.prototype.init = function (platfrmSchema) {
    'use strict';
    this._id = platfrmSchema._id;
    this.code = platfrmSchema.code;
    this.name = platfrmSchema.name;
    this.logo = platfrmSchema.logo;
    this.deps = platfrmSchema.deps;
    this.order = platfrmSchema.order;
    this.upd_at = platfrmSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
PlatfrmMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = PlatfrmMdl;