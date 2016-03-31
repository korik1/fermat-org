var mongoose = require('mongoose');
/**
 * [UsrMdl description]
 *
 * @method UsrMdl
 *
 * @param  {[type]} usrnm      [description]
 * @param  {[type]} email      [description]
 * @param  {[type]} name       [description]
 * @param  {[type]} avatar_url [description]
 * @param  {[type]} github_tkn [description]
 */
function UsrMdl(usrnm, email, name, avatar_url, github_tkn) {
	this.usrnm = usrnm;
	this.email = email;
	this.name = name;
	this.avatar_url = avatar_url;
	this.github_tkn = github_tkn;
	this.upd_at = new mongoose.Types.ObjectId();
}
/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} usrSchema [description]
 *
 * @return {[type]} [description]
 */
UsrMdl.prototype.init = function (usrSchema) {
	this._id = usrSchema._id;
	this.usrnm = usrSchema.usrnm;
	this.email = usrSchema.email;
	this.name = usrSchema.name;
	this.avatar_url = usrSchema.avatar_url;
	this.github_tkn = usrSchema.github_tkn;
	this.upd_at = usrSchema.upd_at;
};
/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
UsrMdl.prototype.setUpdate = function () {
	this.upd_at = new mongoose.Types.ObjectId();
};
// export the class
module.exports = UsrMdl;