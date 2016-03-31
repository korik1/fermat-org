/*global require*/
/*global module*/
var mongoose = require('mongoose');
/**
 * [procSchema description]
 *
 * @type {[type]}
 */
var procSchema = mongoose.Schema({
    platfrm: {
        type: String,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    desc: {
        type: String,
        trim: true
    },
    prev: {
        type: String,
        trim: true
    },
    next: {
        type: String,
        trim: true
    },
    steps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step'
    }],
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'procs'
});
/**
 * [desc description]
 *
 * @type {number}
 */
procSchema.index({
    name: 1
}, {
    name: "procs_cp_indx"
}); // schema level
module.exports = procSchema;