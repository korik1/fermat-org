var tknMod = require('../../../../modules/auth/token');
var appMod = require('../../../../modules/auth/app');
var usrMod = require('../../../../modules/auth/user');
var mongoose = require('mongoose');
var assert = require('assert');
var usr = null;
var app = null;
var axsKey = null;
describe('User', function() {
	before(function() {
		console.log('info', 'Starting database connexion');
		var db = require('../../../../db');
	});

	describe('#insTkn()', function() {
		it('should generate a token without error', function() {
			usrMod.insOrUpdUsr('campol', 'campusprize@gmail.com', 'Luis', new Date(), 'maracaibo', 'avatar', new mongoose.Types.ObjectId(), 'url', 'bio', function(err, res_usr) {
				if (err) return console.log("Error", err);
				if (res_usr) {
					usr = res_usr;
					console.log("User is registered", usr);
					appMod.insApp(usr._id, 'app1', 'desc1', function(err, resp) {
						app = resp;
						console.log("App is registered", app);
						tknMod.insTkn(usr._id, app._id, function(err, resp) {
							axsKey = resp.axs_key;
							console.log("Token", resp);
						});
					});
				}
			});
		});
	});

	describe('#getTkns()', function() {
		it('should get a list of tokens', function() {
			tknMod.getTkns(function(err, resp) {
				assert(resp.length > 0);
				console.log("resp.length", resp.length);
			});
		});
	});

	describe('#getTkn()', function() {
		it('should obtain a token given axs_key', function() {
			tknMod.getTkn(axsKey, function(err, resp) {
				console.log("Token by axsKey " + axsKey, resp);
			});
		});
	});

	describe('#updateTkn()', function() {
		it('should update a token given axs_key', function() {
			tknMod.updateTkn(axsKey, function(err, resp) {
				console.log("Token updated " + axsKey, resp);
			});
		});
	});

	describe('#delTkn()', function() {
		it('should remove a token', function() {
			tknMod.delTkn(axsKey, function(err, resp) {
				assert.equals(true, resp);
				console.log("Token eliminated " + axsKey, resp);
			});
		});
	});
});