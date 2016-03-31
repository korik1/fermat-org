var mongoose = require('mongoose');

/**
 * [devSchema description]
 *
 * @type {[type]}
 */
var devSchema = mongoose.Schema({
    usrnm: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
        //validate: /^[a-zA-Z][a-zA-Z0-9\._\-]{3,14}?[a-zA-Z0-9]{0,2}$/
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: false,
        //validate: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
        'default': null
    },
    name: {
        type: String,
        trim: true,
        'default': null
    },
    bday: {
        type: Date,
        //'default': null
        'default': new Date()
    },
    location: {
        type: String,
        trim: true,
        'default': null
    },
    avatar_url: {
        type: String,
        trim: true,
        'default': null
    },
    url: {
        type: String,
        trim: true,
        'default': null
    },
    bio: {
        type: String,
        trim: true,
        'default': null
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'devs'
});

/**
 * [getAge description]
 *
 * @method getAge
 *
 * @return {[type]} [description]
 */
devSchema.methods.getAge = function () {
    'use strict';
    var diff = new Date() - this.bday;
    var diffdays = diff / 1000 / (60 * 60 * 24);
    var age = Math.floor(diffdays / 365.25);
    return age;
};

/**
 * [usrnm description]
 *
 * @type {[type]}
 */
devSchema.index({
    usrnm: 1
}, {
    unique: true
}, {
    name: "devs_usrnm_uq_indx"
});

/**
 * [usrnm description]
 *
 * @type {number}
 */
devSchema.index({
    usrnm: 1,
    email: 1,
    avatar_url: 1
}, {
    name: "devs_cp_indx"
});

module.exports = devSchema;