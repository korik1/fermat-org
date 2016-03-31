var appMod = require('./app');
var tknMod = require('./token');
var usrMod = require('./user');
var githubLib = require('./lib/github');
var sha256Lib = require('./lib/sha256');
/**
 * [verifAxsKeyRelApiKey description]
 *
 * @method verifAxsKeyRelApiKey
 *
 * @param  {[type]}             api_key  [description]
 * @param  {[type]}             axs_key  [description]
 * @param  {Function}           callback [description]
 *
 * @return {[type]}             [description]
 */
var verifAxsKeyRelApiKey = function (api_key, axs_key, callback) {
	'use strict';
	appMod.findAppByApiKey(api_key, function (err, res) {
		if (err) {
			console.log('error', err);
			return callback(err, false);
		}
		if (res) {
			console.log('info', 'APi Key found');
			tknMod.getTkn(axs_key, function (err_res, res_tkn) {
				if (err_res) {
					console.log('error', err_res);
					return callback(err_res, false);
				}
				if (res_tkn) {
					console.log('info', 'access key found');
					if (res_tkn._app_id.api_key == api_key) {
						console.log('info', 'Match');
						return callback(null, true);
					} else {
						console.log('info', 'No match');
						return callback(null, false);
					}
				} else return callback(null, false);
			});
		} else return callback(null, false);
	});
};
/**
 * Obtain authorization to use the api
 * @param  {[type]}   url      [description]
 * @param  {[type]}   api_key  [description]
 * @param  {Function} callback [description]
 * @return tkn
 */
exports.login = function (url, api_key, callback) {
	try {
		//verifies that the API key is registered
		appMod.findAppByApiKey(api_key, function (err_app, res_app) {
			if (err_app) {
				console.log('Error', err_app);
				return callback(err_app, null);
			}
			if (res_app) {
				console.log('info', 'APi Key found');
				//Get user data that did login
				githubLib.getUsrGithub(url, function (error, usr) {
					if (error) {
						return callback(error, null);
					}
					if (usr) {
						console.log("Inserting user");
						//Registering the user and developer in the database
						usrMod.insOrUpdUsr(usr.usrnm ? usr.usrnm.toLowerCase() : usr.usrnm, //
							usr.email, usr.name, usr.bday, usr.location, usr.avatar_url, usr.github_tkn, usr.url, usr.bio,
							function (err_usr, res_usr) {
								if (err_usr) {
									console.log('error', err_usr);
									return callback(err_usr, null);
								}
								if (res_usr) {
									console.log('info', 'Usr and Dev inserted');
									//Generating the token user
									tknMod.insTkn(res_usr._id, res_app._id, function (err_tkn, res_tkn) {
										if (err_tkn) {
											console.log('error', err_tkn);
											return callback(err_tkn, null);
										}
										if (res_tkn) {
											console.log('info', 'Tkn generated');
											//return token
											tknMod.getTkn(res_tkn.axs_key, function (err_tk, res_tk) {
												if (err_tk) {
													console.log('Error', err_tkn);
													return callback(err_tkn, null);
												}
												if (res_tk) {
													return callback(null, res_tk);
												} else return callback("Unauthorized. Token no found", null);
											});
										} else return callback("Unauthorized. Error generating token", null);
									});
								} else return callback("Unauthorized. Error logging the user", null);
							});
					} else return callback("Unauthorized. User no found", null);
				});
			} else return callback("Unauthorized. Api key no found", null);
		});
	} catch (err) {
		console.log("Error", err);
		return callback(err, null);
	}
};
/**
 * [existApiKeyAndAxsKey description]
 * @param  {[type]}   api_key  [description]
 * @param  {[type]}   axs_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.verifiAxsKeyRelApiKey = function (api_key, axs_key, callback) {
	'use strict';
	try {
		verifAxsKeyRelApiKey(api_key, axs_key, function (err, res) {
			if (err) {
				console.log('error', err);
				return callback(err, false);
			}
			if (res) {
				return callback(null, true);
			} else return callback(null, false);
		});
	} catch (err) {
		console.log("Error", err);
		return callback(err, false);
	}
};
/**
 * [verifiAxsKeyRelApiKeyAndUsrnm description]
 * @param  {[type]}   api_key  [description]
 * @param  {[type]}   axs_key  [description]
 * @param  {[type]}   usrnm    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.verifiAxsKeyRelApiKeyAndUsrnm = function (api_key, axs_key, usrnm, callback) {
	'use strict';
	try {
		appMod.findAppByApiKey(api_key, function (err, res) {
			if (err) {
				console.log('error', err);
				return callback(err, false);
			}
			if (res) {
				console.log('info', 'APi Key found');
				tknMod.getTkn(axs_key, function (err_res, res_tkn) {
					if (err_res) {
						console.log('error', err_res);
						return callback(err_res, false);
					}
					if (res_tkn) {
						console.log('info', 'access key found');
						if ((res_tkn._app_id.api_key == api_key) && (res_tkn._usr_id.usrnm == usrnm)) {
							console.log('info', 'Match');
							return callback(null, true);
						} else {
							console.log('info', 'No match');
							return callback(null, false);
						}
					} else return callback(null, false);
				});
			} else return callback(null, false);
		});
	} catch (err) {
		console.log("Error", err);
		return callback(err, false);
	}
};
/**
 * [logout]
 * @param  {[type]}   api_key  [description]
 * @param  {[type]}   axs_key  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.logout = function (api_key, axs_key, callback) {
	try {
		verifAxsKeyRelApiKey(api_key, axs_key, function (err, res_del) {
			if (err) {
				console.log('error', err);
				return callback(err, false);
			}
			if (res_del) {
				console.log("Authorization granted");
				tknMod.delTkn(axs_key, function (err_res, res_tkn) {
					if (err_res) {
						console.log('error', err_res);
						return callback(err_res, false);
					}
					if (res_tkn) {
						console.log('info', 'logout success');
						return callback(null, true);
					} else {
						console.log('info', 'no logout');
						return callback(null, false);
					}
				});
			} else {
				console.log("Unauthorized user");
				return callback(err, false);
			}
		});
	} catch (err) {
		console.log("Error", err);
		return callback(err, false);
	}
};
/**
 * [verifyTkn description]
 *
 * @method verifyTkn
 *
 * @param  {[type]}   axs_key  [description]
 * @param  {[type]}   digest   [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.verifyTkn = function (axs_key, digest, callback) {
	tknMod.getTkn(axs_key, function (err_tkn, res_tkn) {
		try {
			if (res_tkn) {
				// var usr = res_tkn._usr_id;
				// var app = res_tkn._app_id;
				// var str = usr.usrnm + app.api_key;
				// var hash = sha256Lib.calc(str);
				// console.log('usrnm: ' + usr.usrnm);
				// console.log('api_key: ' + app.api_key);
				// console.log('hash: ' + hash);
				// console.log('digest: ' + digest);
				//if (digest == hash) {
				callback(null, true);
				//} else {
				//tknMod.delTkn(axs_key, function (err_del, res_del) {
				//	if (err_del) {
				//		return callback(err_del, false);
				//	}
				//  return callback(new Error('unauthorized user'), false);
				//});
				//}
			} else if (err_tkn) {
				return callback(err_tkn, false);
			} else {
				return callback(new Error('invalid access key'), false);
			}
		} catch (err) {
			return callback(err, false);
		}
	});
};