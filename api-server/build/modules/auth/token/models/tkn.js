var mongoose = require('mongoose');
/**
 * [TknMdl description]
 *
 * @method TknMdl
 *
 * @param  {[type]} _usr_id [description]
 * @param  {[type]} _app_id [description]
 */
function TknMdl(_usr_id, _app_id) {
	this._usr_id = _usr_id;
	this._app_id = _app_id;
	this.axs_key = new mongoose.Types.ObjectId();
	this.upd_at = new mongoose.Types.ObjectId();
}
/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} tknSchema [description]
 *
 * @return {[type]} [description]
 */
TknMdl.prototype.init = function (tknSchema) {
	this._id = tknSchema._id;
	this._usr_id = tknSchema._usr_id;
	this._app_id = tknSchema._app_id;
	this.axs_key = tknSchema.axs_key;
	this.upd_at = tknSchema.upd_at;
};
/**
 * [getAxsKey description]
 *
 * @method getAxsKey
 *
 * @return {[type]}  [description]
 */
TknMdl.prototype.getAxsKey = function () {
	return this.axs_key + '';
};
/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
TknMdl.prototype.setUpdate = function () {
	this.upd_at = new mongoose.Types.ObjectId();
};
// export the class
module.exports = TknMdl;