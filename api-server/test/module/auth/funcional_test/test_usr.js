var modUsr = require('../../../modules/auth/user');
var mongoose = require('mongoose');

var _INTERVAL = 2000;
var loop = 0;
console.log('info', 'Update interval on every %s minutes', (_INTERVAL / 1000) / 60);
setInterval(function() {
	var mod = loop % 9;
	loop++;
	switch (mod) {
		case 0:
			console.log('info', 'Starting database connexion');
			var db = require('../../../db');
			modUsr.delAllUsrs(function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Delete all users succes ok');
					console.log(res);
				}
			});
			break;
		case 1:
			console.log('info', 'Inserting user');
			modUsr.insOrUpdUsr('campol', 'campusprize@gmail.com', 'Luis', new Date(), 'maracaibo', 'avatar', new mongoose.Types.ObjectId(), 'url', 'bio', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 2:
			console.log('info', 'Inserting user');
			modUsr.insOrUpdUsr('fuelusumar', 'fuelusumar@gmail.com', 'Fuenmayor', new Date(), 'maracaibo', 'avatar', new mongoose.Types.ObjectId(), 'url', 'bio', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 3:
			console.log('info', 'Inserting user');
			modUsr.insOrUpdUsr('mceledon', 'mceledon@gmail.com', 'Miguel', new Date(), 'maracaibo', 'avatar', new mongoose.Types.ObjectId(), 'url', 'bio', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 4:
			console.log('info', 'Inserting user');
			modUsr.insOrUpdUsr('german', 'german@gmail.com', 'German', new Date(), 'caracas', 'avatar', new mongoose.Types.ObjectId(), 'url', 'bio', function(err, res) {
				if (err) {
					console.log('error', err);
				} else {
					console.log('info', 'Succes ok');
					console.log(res);
				}
			});
			break;
		case 5:
			console.log('info', 'Obtaining user list');
			modUsr.getUsrs(function(err_res, res_usrs) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("List users: ");
					console.log(res_usrs);
				}
			});
			break;
		case 6:
			console.log('info', 'Obtaining user by email(campusprize@gmail.com)');
			modUsr.getUsrsByEmail('campusprize@gmail.com', function(err_res, res_usrs) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("User: ");
					console.log(res_usrs);
				}
			});
			break;
		case 7:
			console.log('info', 'Obtaining user by username(mceledon)');
			modUsr.getUsrsByUsrnm('mceledon', function(err_res, res_usrs) {
				if (err_res) {
					console.log('error', err_res);
				} else {
					console.log("User: ");
					console.log(res_usrs);
				}
			});
			break;
		case 8:
			console.log('info', 'Killing process');
			process.exit(1);
			break;
	}
}, _INTERVAL);