var authMod = require('../../../modules/auth');
var mongoose = require('mongoose');

var _INTERVAL = 2000;
var loop = 0;
console.log('info', 'Update interval on every %s minutes', (_INTERVAL / 1000) / 60);
setInterval(function() {
	var mod = loop % 5;
	loop++;
	switch (mod) {
		case 0:
			console.log('info', 'Starting database connexion');
			var db = require('../../../db');
			break;
		case 1:
			console.log('info', 'Test method verifiAxsKeyRelApiKeyAndUsrnm(api_key, axs_key, usrnm, callback)');
			var api_key = "56a10473b27e63185c6970d6";
			var axs_key = "569ff92ec07f1a391b447a37";
			var usrnm = "fuelusumar";
			authMod.verifiAxsKeyRelApiKeyAndUsrnm(api_key, axs_key, usrnm, function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Check api_key, axs_key y usnm');
					console.log(res);
				}
			});
			break;
		case 2:
			console.log('info', 'Test method verifiAxsKeyRelApiKey(api_key, axs_key, callback)');
			var api_key = "56a10473b27e63185c6970d6";
			var axs_key = "569ff92ec07f1a391b447a37";
			var usrnm = "fuelusumar";
			authMod.verifiAxsKeyRelApiKey(api_key, axs_key, function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Check api_key, axs_key');
					console.log(res);
				}
			});
			break;
		case 3:
			console.log('info', 'Test logout');
			var api_key = "56a10473b27e63185c6970d6";
			var axs_key = "569ff92ec07f1a391b447a37";
			authMod.logout(api_key, axs_key, function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					if (res == true)
						console.log('info', 'Logout Succes ok');
					else console.log("No logout");
				}
			});
			break;
		case 4:
			console.log('info', 'Killing process');
			process.exit(1);
			break;
	}
}, _INTERVAL);