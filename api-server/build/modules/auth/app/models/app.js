var mongoose = require('mongoose');
/**
 * [AppMdl description]
 *
 * @method AppMdl
 *
 * @param  {[type]} _owner_id [description]
 * @param  {[type]} name      [description]
 * @param  {[type]} desc      [description]
 */
function AppMdl(_owner_id, name, desc) {
	this._owner_id = _owner_id;
	this.name = name;
	this.desc = desc;
	this.api_key = new mongoose.Types.ObjectId();
	this.upd_at = new mongoose.Types.ObjectId();
}
/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} appSchema [description]
 *
 * @return {[type]} [description]
 */
AppMdl.prototype.init = function (appSchema) {
	this._id = appSchema._id;
	this._owner_id = appSchema._owner_id;
	this.name = appSchema.name;
	this.desc = appSchema.desc;
	this.api_key = appSchema.api_key;
	this.upd_at = appSchema.upd_at;
};
/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
AppMdl.prototype.setUpdate = function () {
	this.upd_at = new mongoose.Types.ObjectId();
};
/**
 * [getApiKey description]
 *
 * @method getApiKey
 *
 * @return {[type]}  [description]
 */
AppMdl.prototype.getApiKey = function () {
	return this.api_key + '';
};
// export the class
module.exports = AppMdl;