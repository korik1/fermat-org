var winston = require('winston');
var loadLib = require('./modules/repository/lib/loader');
var syncLib = require('./modules/repository/lib/syncer');
var loadNet = require('./modules/network/lib/loader');
var modDoc = require('./modules/repository/doc');
var Cache = require('./lib/route-cache');
var cache = new Cache({
	type: 'file'
});
var _INTERVAL = 300000;
var loop = 0;
winston.log('info', 'Update interval on every %s minutes', (_INTERVAL / 1000) / 60);
setInterval(function () {
	'use strict';
	var mod = loop % 12;
	loop++;
	switch (mod) {
	case 0:
		//baja el manifiesto, lo parsea y lo guarda en la base datos y lo actualiza en la base de datos
		/*loadLib.loadComps(function (err, res) {
		    if (err) {
		        winston.log('error', err.message, err);
		    } else {
		        winston.log('debug', 'Components and developers loaded', res);
		    }
		});*/
		loadLib.updProcs(function (err, res) {
			if (err) {
				winston.log('error', err.message, err);
			} else {
				winston.log('debug', 'Proccesses updated', res);
			}
		});
		break;
	case 1:
		//verifica que cada componente esta dentro en la carpeta que le corresponde
		loadLib.updComps(function (err, res) {
			if (err) {
				winston.log('error', err.message, err);
			} else {
				winston.log('debug', 'Components updated', res);
			}
		});
		break;
	case 2:
		//se descarga la informacion de los developers
		loadLib.updDevs(function (err, res) {
			if (err) {
				winston.log('error', err.message, err);
			} else {
				winston.log('debug', 'Developers updated', res);
				cache.clear();
			}
		});
		break;
	case 3:
		winston.log('info', 'Getting documentation');
		syncLib.getBook();
		winston.log('info', 'Documentation loaded');
		break;
	case 4:
		winston.log('info', 'Doing nothing');
		break;
	case 5:
		winston.log('info', 'Doing nothing');
		break;
	case 6:
		modDoc.generateBookPdf(function (err) {
			if (err) {
				winston.log('error', err);
			} else {
				winston.log('info', 'Books are generated');
			}
		});
		break;
	case 7:
		winston.log('info', 'Doing nothing');
		break;
	case 8:
		winston.log('info', 'Doing nothing');
		break;
	case 9:
		winston.log('info', 'Doing nothing');
		break;
	case 10:
		winston.log('info', 'Doing nothing');
		break;
	case 11:
		loadNet.getNetwork(function (err) {
			if (err) {
				winston.log('info', err);
			}
			winston.log('info', 'Get Network and loading');
		});
		break;
	}
}, _INTERVAL);