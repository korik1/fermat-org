var mongoose = require('mongoose');
var tknSrv = require('./services/tkn');
var TknMdl = require('./models/tkn');
/**
 * [instknApp description]
 * @param  {[type]}   _usr_id  [description]
 * @param  {[type]}   _app_id  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.insTkn = function (_usr_id, _app_id, callback) {
	'use strict';
	try {
		tknSrv.findTknByUsrIdAppId(_usr_id, _app_id, function (err, tkn) {
			if (err) {
				return callback(err, null);
			}
			if (tkn) {
				var set_obj = {};
				set_obj.upd_at = new mongoose.Types.ObjectId();
				if (Object.keys(set_obj).length > 0) {
					tknSrv.updateTknByAxsKey(tkn.axs_key, set_obj, function (err_upd, res_upd) {
						if (err_upd) return callback(err_upd, null);
						if (res_upd) return callback(null, tkn);
					});
				}
			} else {
				var tknObj = new TknMdl(_usr_id, _app_id);
				tknSrv.insTkn(tknObj, function (err_ins, res_ins) {
					if (err_ins) {
						return callback(err_ins, null);
					}
					return callback(null, res_ins);
				});
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updatetkn description]
 * @param  {[type]}   axs_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.updateTkn = function (axs_key, callback) {
	'use strict';
	try {
		tknSrv.findTknByAxsKey(axs_key, function (err_tkn, res_tkn) {
			if (err_tkn) {
				return callback(err_tkn, null);
			}
			if (res_tkn) {
				var set_obj = {};
				set_obj.upd_at = new mongoose.Types.ObjectId();
				if (Object.keys(set_obj).length > 0) {
					tknSrv.updateTknByAxsKey(res_tkn.axs_key, set_obj, function (err_upd, res_upd) {
						if (err_upd) {
							return callback(err_upd, null);
						}
						return callback(null, res_upd);
					});
				}
			} else return callback(null, res_tkn);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [gettkns description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getTkns = function (callback) {
	'use strict';
	try {
		tknSrv.findAllTkns({}, {}, function (err, tkns) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, tkns);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [gettkn description]
 * @param  {[type]}   axs_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.getTkn = function (axs_key, callback) {
	'use strict';
	try {
		tknSrv.findTknByAxsKey(axs_key, function (err, tkn) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, tkn);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delTkn description]
 * @param  {[type]}   axs_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.delTkn = function (axs_key, callback) {
	'use strict';
	try {
		tknSrv.delTkn(axs_key, function (err, tkn) {
			if (err) {
				return callback(err, false);
			}
			return callback(null, true);
		});
	} catch (err) {
		return callback(err, false);
	}
};