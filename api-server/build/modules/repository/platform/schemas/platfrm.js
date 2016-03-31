var mongoose = require('mongoose');

/**
 * [platfrmSchema description]
 *
 * @type {[type]}
 */
var platfrmSchema = mongoose.Schema({
    code: {
        type: String,
        uppercase: true,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    deps: [{
        // code reference
        type: String,
        uppercase: true,
        trim: true,
        required: true
    }],
    order: {
        type: Number,
        'default': -1
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'platfrms'
});

/**
 * [code description]
 *
 * @type {number}
 */
platfrmSchema.index({
    code: 1,
    name: 1,
    logo: 1
}, {
    name: "platfrms_cp_indx"
});

module.exports = platfrmSchema;