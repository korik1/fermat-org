var mongoose = require('mongoose');

/**
 * [LayerMdl description]
 *
 * @method LayerMdl
 *
 * @param  {[type]} name    [description]
 * @param  {[type]} lang    [description]
 * @param  {[type]} suprlay [description]
 * @param  {[type]} order   [description]
 */
function LayerMdl(name, lang, suprlay, order) {
    'use strict';
    // always initialize all instance properties
    this.name = name;
    this.lang = lang;
    this.suprlay = suprlay;
    this.order = order;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} layerSchema [description]
 *
 * @return {[type]} [description]
 */
LayerMdl.prototype.init = function (layerSchema) {
    'use strict';
    this._id = layerSchema._id;
    this.name = layerSchema.name;
    this.lang = layerSchema.lang;
    this.suprlay = layerSchema.suprlay || false;
    this.order = layerSchema.order;
    this.upd_at = layerSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
LayerMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = LayerMdl;