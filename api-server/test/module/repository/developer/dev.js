var devMod = require('../../../../modules/repository/developer');
var mongoose = require('mongoose');
var assert = require('assert');
describe('Developer', function() {
	before(function() {
		console.log('info', 'Starting database connexion');
		var db = require('../../../../db');
	});
	describe('#insOrUpdDev()', function() {
		it('should save a developer without error', function() {
			devMod.insOrUpdDev('campusprize', 'campusprize@gmail.com', 'Luis', new Date(), 'maracaibo', 'avatar', 'url', 'bio', function(err, resp) {
				console.log("Dev", resp);
			});
		});
	});
	describe('#getDevs()', function() {
		it('should get a list of developers', function() {
			devMod.getDevs(function(err, resp) {
				assert(resp.length > 0);
				console.log("Devs", resp);
			});
		});
	});
});