var mongoose = require('mongoose');

/**
 * [statusSchema description]
 *
 * @type {mongoose}
 */
var statusSchema = mongoose.Schema({
    _comp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comp'
    },
    name: {
        type: String,
        trim: true
    },
    target: {
        type: Date,
        trim: true
    },
    reached: {
        type: Date,
        trim: true
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'statuses'
});

/**
 * [_comp_id description]
 *
 * @type {number}
 */
statusSchema.index({
    _comp_id: 1,
    name: 1
}, {
    name: "statuses_cp_indx"
}); // schema level

module.exports = statusSchema;