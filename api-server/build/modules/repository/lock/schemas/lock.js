var mongoose = require('mongoose');
/**
 * [lockSchema description]
 *
 * @type {[type]}
 */
var lockSchema = mongoose.Schema({
    _usr_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    _item_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    item_type: {
        // platfrm / suprlay / layer / comp
        type: String,
        lowercase: true,
        trim: true
    },
    priority: {
        type: Number,
        min: 0,
        max: 9,
        'default': 9
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'locks'
});
/**
 * [code description]
 *
 * @type {number}
 */
lockSchema.index({
    _usr_id: 1,
    _item_id: 1,
    item_type: 1,
    priority: 1,
    upd_at: 1
}, {
    name: "locks_cp_indx"
}); // schema level
module.exports = lockSchema;