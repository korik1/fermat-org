var appMod = require('../../../modules/auth/app');
var usrMod = require('../../../modules/auth/user');
var mongoose = require('mongoose');


var ownerId = null;
var apiKey = null;
var _INTERVAL = 2000;
var loop = 0;
console.log('info', 'Update interval on every %s minutes', (_INTERVAL / 1000) / 60);
setInterval(function() {
	var mod = loop % 3;
	loop++;
	switch (mod) {
		case 0:
			console.log('info', 'Starting database connexion');
			var db = require('../../../db');
			/*appMod.delAllApps(function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Delete all app succes ok');
					console.log(res);
				}
			});*/
			break;
		/*case 1:
			console.log('info', 'Obtaining user by username(campol)');
			usrMod.getUsrsByUsrnm('campol', function(err_res, res_usrs) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("User: ");
					ownerId = res_usrs._id;
					console.log("ownerId: " + ownerId);
				}
			});
			break;
		case 2:
			console.log('info', 'Register app1');
			appMod.insApp(ownerId, 'app1', 'desc1', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
					apiKey = res.api_key;
				}
			});
			break;
		case 3:
			console.log('info', 'Obtaining user by username(mceledon)');
			usrMod.getUsrsByUsrnm('mceledon', function(err_res, res_usrs) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("User: ");
					ownerId = res_usrs._id;
					console.log("ownerId: " + ownerId);
				}
			});
			console.log('info', 'Register app2');
			appMod.insApp(ownerId, 'app2', 'desc2', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 4:
			console.log('info', 'Register app3');
			appMod.insApp(ownerId, 'app3', 'desc3', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 5:
			console.log('info', 'Register app4');
			appMod.insApp(ownerId, 'app1', 'desc4', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 6:
			appMod.getApps(function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'List access with apps registered');
					console.log(res);
				}
			});
			break;*/
		case 1:
			apiKey = "56a10473b27e63185c6970d6";
			appMod.findAppByApiKey(apiKey, function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Find App registered by apikey');
					console.log(res);
				}
			});
			break;
		case 2:
			console.log('info', 'Killing process');
			process.exit(1);
			break;
	}
}, _INTERVAL);