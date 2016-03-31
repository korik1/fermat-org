var request = require('request');
var winston = require('winston');
var linkMod = require('./../link');
var nodeMod = require('./../node');
var waveMod = require('./../wave');
var env = process.env.NODE_ENV || 'development';
var USER_AGENT = (env === 'development') ? 'Miguelcldn' : 'fuelusumar';
/**
 * [doRequest description]
 *
 * @method doRequest
 *
 * @param  {[type]}   method   [description]
 * @param  {[type]}   url      [description]
 * @param  {[type]}   params   [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var doRequest = function (method, url, params, callback) {
	'use strict';
	try {
		var form, i;
		winston.log('debug', 'Doing request %s', url);
		switch (method) {
		case 'POST':
			form = {};
			if (params && Array.isArray(params) && params.length > 0) {
				for (i = params.length - 1; i >= 0; i--) {
					form[params[i].key] = params[i].value;
				}
			}
			request.post({
				url: url,
				form: form,
				headers: {
					'User-Agent': USER_AGENT,
					'Accept': 'application/json'
				}
			}, function (err, res, body) {
				return callback(err, body);
			});
			break;
		case 'GET':
			request.get({
				url: url,
				headers: {
					'User-Agent': USER_AGENT,
					'Accept': 'application/json'
				}
			}, function (err, res, body) {
				return callback(err, body);
			});
			break;
		}
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [createWave description]
 *
 * @method createWave
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var createWave = function (callback) {
	'use strict';
	try {
		var date = new Date();
		var desc = "wave " + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		waveMod.insertWave(desc, function (err, res_wave) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, res_wave);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [findNodeByHash description]
 *
 * @method findNodeByHash
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var findNodeByHash = function (_nodes, hash, callback) {
	var l = _nodes.length;
	for (var i = 0; i < l; i++) {
		if (_nodes[i].hash === hash) {
			return callback(null, _nodes[i]);
		}
	}
};
/**
 * [createChildren description]
 *
 * @method createChildren
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var createChildren = function (_wave, _nodes, callback) {
	var loopNodes = function (i) {
		if (i < _nodes.length) {
			var _node = _nodes[i];
			var loopChildren = function (j) {
				if (j < _node.chldrn.length) {
					findNodeByHash(_nodes, _node.chldrn[j], function (err_chld, res_chld) {
						if (err_chld) {
							winston.log('error', err_chld.message, err_chld);
						}
						linkMod.insertLink(_wave._id, res_chld._id, _node._id, 'connected', function (err_link, res_link) {
							if (err_link) {
								winston.log('error', err_link.message, err_link);
							}
							loopChildren(++j);
						});
					});
				} else {
					winston.log('debug', 'done loading children for ' + _node.hash);
					loopNodes(++i);
				}
			};
			loopChildren(0);
		} else {
			winston.log('info', 'done loading children for all nodes');
			callback(null, {
				'message': 'done loading children for all nodes'
			});
		}
	};
	loopNodes(0);
};
/**
 * [createNodes description]
 *
 * @method createNodes
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var createNodes = function (_wave, _nodes, callback) {
	var loopNodes = function (i) {
		if (i < _nodes.length) {
			var _node = _nodes[i];
			nodeMod.insertNod(_wave._id, _node.hash, _node.type, _node.extra.os, _node.extra.sub, null, null, null, null, function (err_nod, res_nod) {
				if (err_nod) {
					winston.log('error', err_nod.message, err_nod);
				}
				_nodes[i]._id = res_nod._id;
				loopNodes(++i);
			});
		} else {
			createChildren(_wave, _nodes, function (err_chld, res_chld) {
				if (err_chld) {
					winston.log('error', err_chld.message, err_chld);
				}
				winston.log('info', 'done loading children');
				return callback(null, res_chld);
			});
		}
	};
	loopNodes(0);
};
/**
 * [getNetwork description]
 *
 * @method getNetwork
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getNetwork = function (callback) {
	'use strict';
	try {
		doRequest('GET', 'https://api.myjson.com/bins/3trin', null, function (err_req, body) {
			if (err_req) {
				return callback(err_req, null);
			}
			var reqBody = JSON.parse(body);
			createWave(function (err_wave, res_wave) {
				if (err_wave) {
					return callback(err_wave, null);
				}
				createNodes(res_wave, reqBody, function (err_nod, res_nod) {
					if (err_nod) {
						return callback(err_nod, null);
					}
				});
			});
		});
	} catch (err) {
		return callback(err, null);
	}
};
exports.createWave = function (callback) {
	createWave(callback);
};
exports.createNodes = function (_wave, _nodes, callback) {
	createNodes(_wave, _nodes, callback);
};