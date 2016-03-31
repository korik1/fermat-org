/*global require*/
/*global module*/
var mongoose = require('mongoose');

/**
 * [stepSchema description]
 *
 * @type {[type]}
 */
var stepSchema = mongoose.Schema({
    _proc_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proc'
    },
    _comp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comp'
    },
    type: {
        lowercase: true,
        type: String,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    desc: {
        type: String,
        trim: true
    },
    order: {
        type: Number,
        'default': 0
    },
    next: [],
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'steps'
});

/**
 * [code description]
 *
 * @type {number}
 */
stepSchema.index({
    _comp_id: 1
}, {
    name: "steps_indx"
}); // schema level

module.exports = stepSchema;