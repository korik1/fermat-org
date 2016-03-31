var mongoose = require('mongoose');

/**
 * [layerSchema description]
 *
 * @type {[type]}
 */
var layerSchema = mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        trim: true
    },
    lang: {
        type: String,
        lowercase: true,
        trim: true
    },
    suprlay: {
        type: String,
        uppercase: true,
        trim: true,
        'default': null
    },
    order: {
        type: Number,
        'default': -1
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'layers'
});

/**
 * [name description]
 *
 * @type {number}
 */
layerSchema.index({
    name: 1,
    lang: 1
}, {
    name: "layers_cp_indx"
});

module.exports = layerSchema;