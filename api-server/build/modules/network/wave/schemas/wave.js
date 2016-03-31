var mongoose = require('mongoose');

/**
 * this entity represents an instance of time in the network's growth 
 *
 * @type {[type]}
 */
var wavSchema = mongoose.Schema({
    desc: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    time: {
        type: Date,
        'default': Date.now
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'wavs'
});

/**
 * [time description]
 *
 * @type {number}
 */
wavSchema.index({
    time: 1,
    upd_at: 1
}, {
    name: "wavs_cp_indx"
});

module.exports = wavSchema;