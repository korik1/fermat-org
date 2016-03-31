var mongoose = require('mongoose');
/**
 * represents and access token for system authentication
 * the idea is to get the axs_tkn (access token) and the api_key and usrnm, both encoded
 * decode them, and with this two parameters find them and find the axs_tkn nd see if
 * the _usr_id, _app_id and axs_tkn match, if true authenticated else unauthorized 
 *
 * @type {[type]}
 */
var tknSchema = mongoose.Schema({
	_usr_id: { // token user owner
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Usr'
	},
	_app_id: { // token's app owner
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'App'
	},
	axs_key: { // access token
		type: mongoose.Schema.Types.ObjectId,
		'default': new mongoose.Types.ObjectId()
	},
	upd_at: {
		type: mongoose.Schema.Types.ObjectId,
		'default': new mongoose.Types.ObjectId()
	}
}, {
	collection: 'tkns'
});
/**
 * [_usr_id description]
 *
 * @type {number}
 */
tknSchema.index({
	_usr_id: 1,
	_app_id: 1,
	tkn: 1
}, {
	name: "tkns_cp_indx"
});
module.exports = tknSchema;