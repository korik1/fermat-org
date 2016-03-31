var mongoose = require('mongoose');

/**
 * [WaveMdl coonstructor]
 *
 * @method WavMdl
 *
 * @param  {[type]} desc      [description]
 */
function WaveMdl(desc) {
    'use strict';
    // always initialize all instance properties
    this.desc = desc;
    this.time = new Date();
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} waveSchema [description]
 *
 * @return {[type]} [description]
 */
WaveMdl.prototype.init = function (waveSchema) {
    'use strict';
    this._id = waveSchema._id;
    this.desc = waveSchema.desc;
    this.time = waveSchema.time;
    this.upd_at = waveSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
WaveMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};


// export the class
module.exports = WaveMdl;