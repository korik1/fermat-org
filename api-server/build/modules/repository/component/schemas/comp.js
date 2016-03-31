var mongoose = require('mongoose');
/**
 * [compSchema description]
 *
 * @type {[type]}
 */
var compSchema = mongoose.Schema({
	_platfrm_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Platfrm'
	},
	_suprlay_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Suprlay'
	},
	_layer_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Layer'
	},
	name: {
		lowercase: true,
		type: String,
		trim: true
	},
	type: {
		// library / android / addon / plugin
		type: String,
		lowercase: true,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	difficulty: {
		type: Number,
		min: 0,
		'default': 0
	},
	code_level: {
		type: String,
		lowercase: true,
		trim: true
	},
	repo_dir: {
		type: String,
		trim: true
	},
	scrnshts: {
		type: Boolean,
		'default': false
	},
	found: {
		type: Boolean,
		'default': false
	},
	devs: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'CompDev'
    }],
	certs: [{
		type: mongoose.Schema.Types.ObjectId //,
			//ref: 'Cert'
    }],
	life_cycle: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Status'
    }],
	upd_at: {
		type: mongoose.Schema.Types.ObjectId,
		'default': new mongoose.Types.ObjectId()
	}
}, {
	collection: 'comps'
});
compSchema.index({
	_platfrm_id: 1,
	_suprlay_id: 1,
	_layer_id: 1,
	name: 1
}, {
	unique: true
}, {
	name: "comps_uq_indx"
});
/**
 * [code description]
 *
 * @type {number}
 */
compSchema.index({
	_platfrm_id: 1,
	_suprlay_id: 1,
	_layer_id: 1,
	code: 1,
	name: 1,
	logo: 1
}, {
	name: "comps_cp_indx"
}); // schema level
module.exports = compSchema;