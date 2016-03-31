var usrMod = require('../../../../modules/auth/user');
var mongoose = require('mongoose');
var assert = require('assert');
var usrNm = null;
var email = null;
describe('User', function() {
	before(function() {
		console.log('info', 'Starting database connexion');
		var db = require('../../../../db');
	});

	describe('#delAllUsrs()', function() {
		it('should remove all users', function(done) {
			usrMod.delAllUsrs(done);
		});
	});

	describe('#insOrUpdUsr()', function() {
		it('should save a user without error', function() {
			usrMod.insOrUpdUsr('campol', 'campusprize@gmail.com', 'Luis', new Date(), 'maracaibo', 'avatar', new mongoose.Types.ObjectId(), 'url', 'bio', function(err, resp) {
				usrNm = resp.usrnm;
				email = resp.email;
				console.log("Usr", resp);
			});
		});
	});

	describe('#getUsrs()', function() {
		it('should get a list of users', function() {
			usrMod.getUsrs(function(err, resp) {
				assert(resp.length > 0);
				console.log("resp.length", resp.length);
			});
		});
	});

	describe('#getUsrsByEmail()', function() {
		it('should obtain a given user email', function() {
			usrMod.getUsrsByEmail(email, function(err, resp) {
				console.log("User by email "+email, resp);
			});
		});
	});

	describe('#getUsrsByUsrnm()', function() {
		it('should obtain a given user name', function() {
			usrMod.getUsrsByUsrnm('campol', function(err, resp) {
				console.log("User by user name "+usrNm, resp);
			});
		});
	});
});