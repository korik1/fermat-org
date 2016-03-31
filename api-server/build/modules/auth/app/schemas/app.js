var mongoose = require('mongoose');
/**
 * represents an app subscribed to the API
 *
 * @type {[type]}
 */
var appSchema = mongoose.Schema({
    _owner_id: { // app owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usr'
    },
    name: { // app name
        type: String,
        trim: true,
        required: true
            //validate: /^[a-zA-Z][a-zA-Z0-9\._\-]{3,14}?[a-zA-Z0-9]{0,2}$/
    },
    desc: { // app description
        type: String,
        trim: true,
        //validate: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
        'default': null
    },
    api_key: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'apps'
});
/**
 * [_owner_id description]
 *
 * @type {number}
 */
appSchema.index({
    _owner_id: 1,
    name: 1,
    api_key: 1
}, {
    name: "apps_cp_indx"
});
module.exports = appSchema;