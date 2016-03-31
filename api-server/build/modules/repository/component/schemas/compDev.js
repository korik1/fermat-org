var mongoose = require('mongoose');

/**
 * [compDevSchema description]
 *
 * @type {[type]}
 */
var compDevSchema = mongoose.Schema({
    _dev_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dev'
    },
    _comp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comp'
    },
    role: {
        type: String,
        trim: true
    },
    scope: {
        type: String,
        trim: true
    },
    percnt: {
        type: Number,
        min: 0,
        max: 100,
        'default': 0
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'comp_devs'
});

/**
 * [_dev_id description]
 *
 * @type {number}
 */
compDevSchema.index({
    _dev_id: 1,
    _comp_id: 1,
    scope: 1
}, {
    name: "comp_devs_cp_indx"
}); // schema level

module.exports = compDevSchema;