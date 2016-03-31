var mongoose = require('mongoose');
/**
 * represents a system user
 *
 * @type {[type]}
 */
var usrSchema = mongoose.Schema({
    usrnm: { // username
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
        required: true,
        //validate: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
        'default': null
    },
    name: {
        type: String,
        trim: true,
        'default': null
    },
    avatar_url: {
        type: String,
        trim: true,
        'default': null
    },
    github_tkn: {
        type: String,
        trim: true,
        required: true,
        'default': null
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'usrs'
});
/**
 * [usrnm description]
 *
 * @type {[type]}
 */
usrSchema.index({
    usrnm: 1
}, {
    unique: true
}, {
    name: "usrs_usrnm_uq_indx"
});
/**
 * [usrnm description]
 *
 * @type {number}
 */
usrSchema.index({
    usrnm: 1,
    email: 1
}, {
    name: "usrs_cp_indx"
});
module.exports = usrSchema;