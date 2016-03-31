var mongoose = require('mongoose');

/**
 * [TeamMdl description]
 *
 * @method TeamMdl
 *
 * @param  {[type]} name     [description]
 * @param  {[type]} descript [description]
 */
function TeamMdl(name, descript) {
    'use strict';
    // always initialize all instance properties
    this.name = name;
    this.descript = descript;
    this.devs = [];
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} teamSchema [description]
 *
 * @return {[type]} [description]
 */
TeamMdl.prototype.init = function (teamSchema) {
    'use strict';
    this._id = teamSchema._id;
    this.name = teamSchema.name;
    this.descript = teamSchema.descript;
    this.devs = teamSchema.devs;
    this.upd_at = teamSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
TeamMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = TeamMdl;