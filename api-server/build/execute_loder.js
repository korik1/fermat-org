var winston = require('winston');
var loadLib = require('./modules/repository/lib/loader');

loadLib.loadComps(function (err, res) {
    if (err) {
        winston.log('error', err.message, err);
    } else {
        winston.log('debug', 'Components and developers loaded', res);
    }
});