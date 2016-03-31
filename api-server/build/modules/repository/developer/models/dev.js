var mongoose = require('mongoose');

/**
 * [DevMdl coonstructor]
 *
 * @method DevMdl
 *
 * @param  {[type]} usrnm      [description]
 * @param  {[type]} email      [description]
 * @param  {[type]} name       [description]
 * @param  {[type]} bday       [description]
 * @param  {[type]} location   [description]
 * @param  {[type]} avatar_url [description]
 * @param  {[type]} url        [description]
 * @param  {[type]} bio        [description]
 */
function DevMdl(usrnm, email, name, bday, location, avatar_url, url, bio) {
    'use strict';
    // always initialize all instance properties
    this.usrnm = usrnm;
    this.email = email;
    this.name = name;
    this.bday = bday;
    this.location = location;
    this.avatar_url = avatar_url;
    this.url = url;
    this.bio = bio;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} devSchema [description]
 *
 * @return {[type]} [description]
 */
DevMdl.prototype.init = function (devSchema) {
    'use strict';
    this._id = devSchema._id;
    this.usrnm = devSchema.usrnm;
    this.email = devSchema.email;
    this.name = devSchema.name;
    this.bday = devSchema.bday;
    this.location = devSchema.location;
    this.avatar_url = devSchema.avatar_url;
    this.url = devSchema.url;
    this.bio = devSchema.bio;
    this.upd_at = devSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
DevMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};

/**
 * [getAge description]
 *
 * @method getAge
 *
 * @return {[type]} [description]
 */
DevMdl.prototype.getAge = function () {
    'use strict';
    var diff = new Date() - this.bday;
    var diffdays = diff / 1000 / (60 * 60 * 24);
    var age = Math.floor(diffdays / 365.25);
    return age;
};

// export the class
module.exports = DevMdl;