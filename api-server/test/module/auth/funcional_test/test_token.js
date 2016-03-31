var modTkn = require('../../../modules/auth/token');
var mongoose = require('mongoose');
var accessKey = null;
var _INTERVAL = 2000;
var loop = 0;
console.log('info', 'Update interval on every %s minutes', (_INTERVAL / 1000) / 60);
setInterval(function() {
	var mod = loop % 7;
	loop++;
	switch (mod) {
		case 0:
			console.log('info', 'Starting database connexion');
			var db = require('../../../db');
			break;
		/*case 1:
			console.log('info', 'Inserting Tkn 1 ');
			modTkn.insTkn(new mongoose.Types.ObjectId("569ff8867a833e1f1bd9b4d3"), new mongoose.Types.ObjectId("569ff9157bdc782d1b1f3343"), function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 2:
			console.log('info', 'Inserting Tkn 2');
			modTkn.insTkn(new mongoose.Types.ObjectId("569ff8827a833e1f1bd9b4c5"), new mongoose.Types.ObjectId("569ff9117bdc782d1b1f3338"), function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
					accessKey = res.axs_key;
					console.log("accessKey: "+accessKey);
				}
			});
			break;
		case 3:
			console.log('info', 'Obtaining Tkn list');
			modTkn.getTkns(function(err_res, res_tkn) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("List Tkns: ");
					console.log(res_tkn);
				}
			});
			break;
		case 4: 
			console.log('info', 'Update Tkn by acces key: '+accessKey);
			modTkn.updateTkn(accessKey, function(err_res, res_tkn) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("Tkn updated: ");
					console.log(res_tkn);
				}
			});
			break;*/
		case 5:
			console.log('info', 'Obtaining Tkn by access key: '+accessKey);
			modTkn.getTkn(new mongoose.Types.ObjectId("569ff92ec07f1a391b447a37"), function(err_res, res_tkn) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("Tkn: ");
					console.log(res_tkn);
				}
			});
			break;
		case 6:
			console.log('info', 'Killing process');
			process.exit(1);
			break;
	}
}, _INTERVAL);