var mongoose = require('mongoose');
/**
 * [CompMdl constructor]
 *
 * @method CompMdl
 *
 * @param  {[type]} _platfrm_id [description]
 * @param  {[type]} _suprlay_id [description]
 * @param  {[type]} _layer_id   [description]
 * @param  {[type]} name        [description]
 * @param  {[type]} type        [description]
 * @param  {[type]} description [description]
 * @param  {[type]} difficulty  [description]
 * @param  {[type]} code_level  [description]
 * @param  {[type]} repo_dir  [description]
 * @param  {[type]} scrnshts  [description]
 */
function CompMdl(_platfrm_id, _suprlay_id, _layer_id, name, type, description, difficulty, code_level, repo_dir, scrnshts) {
    'use strict';
    // always initialize all instance properties
    this._platfrm_id = _platfrm_id;
    this._suprlay_id = _suprlay_id;
    this._layer_id = _layer_id;
    this.name = name;
    this.type = type;
    this.description = description;
    this.difficulty = difficulty;
    this.code_level = code_level;
    this.repo_dir = repo_dir;
    this.scrnshts = scrnshts;
    this.found = false;
    this.devs = [];
    this.certs = [];
    this.life_cycle = [];
    this.upd_at = new mongoose.Types.ObjectId();
}
/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} compSchema [description]
 *
 * @return {[type]} [description]
 */
CompMdl.prototype.init = function (compSchema) {
    'use strict';
    this._id = compSchema._id;
    this._platfrm_id = compSchema._platfrm_id;
    this._suprlay_id = compSchema._suprlay_id;
    this._layer_id = compSchema._layer_id;
    this.name = compSchema.name;
    this.type = compSchema.type;
    this.description = compSchema.description;
    this.difficulty = compSchema.difficulty;
    this.code_level = compSchema.code_level;
    this.repo_dir = compSchema.repo_dir;
    this.scrnshts = compSchema.scrnshts;
    this.found = compSchema.found;
    this.devs = compSchema.devs;
    this.certs = compSchema.certs;
    this.life_cycle = compSchema.life_cycle;
    this.upd_at = compSchema.upd_at;
};
/**
 * [getCode description]
 *
 * @method getCode
 *
 * @return {[type]} [description]
 */
CompMdl.prototype.getCode = function () {
    'use strict';
    var words = this.name.split(" ");
    var code = "";

    function capFirstLetter(string) {
        var wrds = string.split(" ");
        var result = "";
        var i, l;
        for (i = 0, l = wrds.length; i < l; i++) {
            result += wrds[i].charAt(0).toUpperCase() + wrds[i].slice(1) + " ";
        }
        return result.trim();
    }
    if (words.length === 1) { //if N = 1, use whole word or 3 first letters
        code = words[0].length <= 4 ? capFirstLetter(words[0]) : capFirstLetter(words[0].slice(0, 3));
    } else if (words.length === 2) { //if N = 2 use first cap letter, and second letter
        code += words[0].charAt(0).toUpperCase() + words[0].charAt(1);
        code += words[1].charAt(0).toUpperCase() + words[1].charAt(1);
    } else { //if N => 3 use the N (up to 4) letters caps
        var max = (words.length < 4) ? words.length : 4;
        var i;
        for (i = 0; i < max; i++) {
            code += words[i].charAt(0);
        }
    }
    return code;
};
/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
CompMdl.prototype.setUpdate = function () {
    'use strict';
    this.upd_at = new mongoose.Types.ObjectId();
};
// export the class
module.exports = CompMdl;