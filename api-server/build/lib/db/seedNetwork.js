var faker = require('faker');
var mongoose = require('mongoose');
var crypto = require('crypto');
var db = require('../../db');
var modWav = require('../../modules/network/wave');
var servWave = require('../../modules/network/wave/services/wave');
var modLink = require('../../modules/network/link');
var servLink = require('../../modules/network/link/services/link');
var modNode = require('../../modules/network/node');
var servNode = require('../../modules/network/node/services/nod');
var parentNodes = [];
var lengthParent = 10;
var lengthChildren = 5;
var linuxTypeServer = "linux";
var nodeTypeServer = "server";
var androidTypeClient = "android";
var nodeTypeClient = "node";
var hash = "";
var loadWave = function () {
	modWav.insertWave(faker.lorem.sentence(), function (err, res_wav) {
		if (err) {
			console.log("Error insert Wave");
		} else {
			for (var i = 0; i < lengthParent; i++) {
				hash = crypto.createHash('md5').update(faker.name.firstName()).digest('hex');
				modNode.insertNod(res_wav._id, hash, nodeTypeServer, linuxTypeServer, "ubuntu", null, null, null, null, function (err, res_server) {
					if (err) {
						console.log("Error insert node server");
					} else {
						for (var j = 0; j < lengthChildren; j++) {
							hash = crypto.createHash('md5').update(faker.name.firstName()).digest('hex');
							modNode.insertNod(res_wav._id, hash, nodeTypeClient, androidTypeClient, "phone", null, null, null, null, function (err, res_cli) {
								if (err) {
									console.log("Error insert node client");
								} else {
									modLink.insertLink(res_wav._id, res_cli._id, res_server._id, "connected", function (err, link) {});
									for (var k = 0; k < 5; k++) {
										modNode.insertNod(res_wav._id, hash, "service", null, "network", null, null, null, null, function (err, res_serc) {
											if (err) {
												console.log("Error insert node client");
											} else {
												modLink.insertLink(res_wav._id, res_serc._id, res_cli._id, "running", function (err, link) {});
											}
										});
									}
								}
							});
						}
					}
				});
			}
		}
	});
};
/* Clear db */
servWave.delAllWaves(function () {
	console.log("Delete all waves");
	servLink.delAllLinks(function () {
		console.log("Delete all links");
		servNode.delAllNods(function () {
			console.log("Delete all nodes");
			loadWave();
		});
	});
});