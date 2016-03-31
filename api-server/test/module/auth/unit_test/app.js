var appMod = require('../../../../modules/auth/app');
var mongoose = require('mongoose');
var assert = require('assert');
var appId = null;
var apiKey = null;
describe('App', function() {
	before(function() {
		console.log('info', 'Starting database connexion');
		var db = require('../../../../db');
	});

	describe('#delAllApps()', function() {
		it('should remove all apps', function(done) {
			appMod.delAllApps(done);
		});
	});

	describe('#inserApp()', function() {
		it('should save a app without error', function() {
			appMod.insApp(new mongoose.Types.ObjectId(), 'app1', 'desc1', function (err, resp) {				
				appId = resp._id;
				apiKey = resp.api_key;
			});
		});
	});

	describe('#getApps()', function() {
		it('should get a list of apps', function() {
			var result = appMod.getApps(function (err, resp) {
				assert(resp.length > 0);
				console.log("resp.length", resp.length);
			});
		});
	});

	describe('#findAppById()', function() {
		it('should obtain a given app id', function() {
			var result = appMod.findAppById(appId, function (err, resp) {
				console.log("resp", resp);
			});
		});
	});

	describe('#findAppByApiKey()', function() {
		it('should obtain an app given the apikey', function() {
			var result = appMod.findAppByApiKey(apiKey, function (err, resp) {
				console.log("resp", resp);
			});
		});
	});
});