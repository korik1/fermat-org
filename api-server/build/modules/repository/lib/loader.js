/*jshint -W069 */
/**
Procesa el manifest del repositorio Fermat
**/
var winston = require('winston');
var request = require('request');
var fs = require('fs');
var path = require('path');
var parseString = require('xml2js').parseString;
var platfrmMod = require('../platform');
var suprlayMod = require('../superlayer');
var layerMod = require('../layer');
var compMod = require('../component');
var procMod = require('../process');
var devMod = require('../developer');
var Cache = require('../../../lib/route-cache');
var config = require('../../../config');
var USER_AGENT = config.user_agent;
var TOKEN = config.oauth_token; // fuelusumar
/**
 * [getRepoDir description]
 *
 * @method getRepoDir
 *
 * @param  {[type]}   section [description]
 * @param  {[type]}   layer   [description]
 * @param  {[type]}   type    [description]
 * @param  {[type]}   comp    [description]
 * @param  {[type]}   team    [description]
 *
 * @return {[type]}   [description]
 */
var getRepoDir = function (section, layer, type, comp, team) {
	'use strict';
	try {
		var _root = "fermat",
			_section = section ? section.toUpperCase().split(' ').join('_') : null,
			_type = type ? type.toLowerCase().split(' ').join('_') : null,
			_layer = layer ? layer.toLowerCase().split(' ').join('_') : null,
			_comp = comp ? comp.toLowerCase().split(' ').join('-') : null,
			_team = team ? team.toLowerCase().split(' ').join('-') : null;
		if (_section && _type && _layer && _comp && _team) {
			return _section + "/" + _type + "/" + _layer + "/" + _root + "-" + _section.split('_').join('-').toLowerCase() + "-" + _type.split('_').join('-') + "-" + _layer.split('_').join('-') + "-" + _comp + "-" + _team;
		}
		return null;
	} catch (err) {
		winston.log('error', err.message, err);
		return null;
	}
};
/**
 * [processComp description]
 *
 * @method processComp
 *
 * @param  {[type]}    section [description]
 * @param  {[type]}    layer   [description]
 * @param  {[type]}    comp    [description]
 * @param  {[type]}    type    [description]
 *
 * @return {[type]}    [description]
 */
var processComp = function (section, layer, comp, type) {
	'use strict';
	try {
		var i, dev, status, devs, _authors, _maintainers, _life_cycle, life_cycle, proComp;
		proComp = {};
		proComp = comp['$'];
		proComp.screenshots = proComp.screenshots && proComp.screenshots.trim().toLowerCase() == "true" ? true : false;
		proComp.type = type;
		proComp.repo_dir = getRepoDir(section.code, layer.name, type, proComp.name, 'bitdubai');
		devs = [];
		_authors = comp.authors && comp.authors[0] && comp.authors[0].author ? comp.authors[0].author : [];
		_maintainers = comp.maintainers && comp.maintainers[0] && comp.maintainers[0].maintainer ? comp.maintainers[0].maintainer : [];
		_life_cycle = comp.life_cycle && comp.life_cycle[0] && comp.life_cycle[0].status ? comp.life_cycle[0].status : [];
		for (i = 0; i < _authors.length; i++) {
			dev = {};
			dev = _authors[i]['$'];
			dev.role = 'author';
			devs.push(dev);
		}
		for (i = 0; i < _maintainers.length; i++) {
			dev = {};
			dev = _maintainers[i]['$'];
			dev.role = 'maintainer';
			devs.push(dev);
		}
		proComp.devs = devs;
		life_cycle = [];
		for (i = 0; i < _life_cycle.length; i++) {
			status = {};
			status = _life_cycle[i]['$'];
			life_cycle.push(status);
		}
		proComp.life_cycle = life_cycle;
		return proComp;
	} catch (err) {
		winston.log('error', err.message, err);
		return null;
	}
};
/**
 * [processCompList description]
 *
 * @method processCompList
 *
 * @param  {[type]}        section  [description]
 * @param  {[type]}        layer    [description]
 * @param  {[type]}        compList [description]
 * @param  {[type]}        type     [description]
 *
 * @return {[type]}        [description]
 */
var processCompList = function (section, layer, compList, type) {
	'use strict';
	try {
		var comps, comp, i;
		comps = [];
		for (i = 0; i < compList.length; i++) {
			comp = {};
			comp = processComp(section, layer, compList[i], type);
			comps.push(comp);
		}
		return comps;
	} catch (err) {
		winston.log('error', err.message, err);
		return null;
	}
};
/**
 * 
 * [doRequest description]
 * Hace un request al api de github
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
		var env = process.env.NODE_ENV || 'development';
		var form, i;
		url += '?access_token=' + TOKEN;
		if (env === 'development' || env === 'testing') {
			url += '&ref=develop';
		}
		//winston.log('info', 'Doing request %s', url);
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
 * [processRequestBody description]
 * obtiene el manifest de github
 * @method processRequestBody
 *
 * @param  {[type]}           body     [description]
 * @param  {Function}         callback [description]
 *
 * @return {[type]}           [description]
 */
var processRequestBody = function (body, callback) {
	'use strict';
	try {
		var reqBody = JSON.parse(body);
		if (reqBody.content && reqBody.encoding) {
			var content = new Buffer(reqBody.content, reqBody.encoding);
			return callback(null, content.toString());
		}
		if (reqBody.login || reqBody.message || Array.isArray(reqBody)) {
			return callback(null, reqBody);
		}
		return callback(new Error('body without any content'), null);
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [getManifestWithExt description]
 *
 * @method getManifestWithExt
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.getManifestWithExt = function (ext, callback) {
	try {
		/*var cwd = process.cwd(),
		    env = process.env.NODE_ENV || 'development',
		    file = path.join(cwd, 'cache', env, 'fermat/FermatManifest.'+ ext);

		fs.lstat(file, function (err, stats) {
		    if (!err && stats.isFile()) {
		        // Yes it is
		        //winston.log('info', 'Read Cache FermatManifest.'+ ext +' %s', file);
		        fs.readFile(file, function (err_read, res_read) {
		            if (err_read) {
		                return callback(err_read, null);
		            }
		            return callback(null, res_read);                   
		        });

		    } else {
		        if (err) {
		            //winston.log('info', err.message, err);
		        }*/
		doRequest('GET', 'https://api.github.com/repos/Fermat-ORG/fermat/contents/FermatManifest.' + ext, null, function (err_req, res_req) {
			if (err_req) {
				return callback(err_req, null);
			}
			processRequestBody(res_req, function (err_pro, res_pro) {
				if (err_pro) {
					return callback(err_pro, null);
				}
				if (typeof res_pro.message != 'undefined' && res_pro.message == 'Bad credentials') {
					return callback(res_pro.message, null);
				}
				var strCont = res_pro.split('\n').join(' ').split('\t').join(' ');
				return callback(null, strCont);
			});
		});
		/*    }
		});*/
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [getManifest description]
 * pasa el manifest a un objeto json
 * @method getManifest
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
var getManifest = function (callback) {
	'use strict';
	try {
		/*var cwd = process.cwd(),
			env = process.env.NODE_ENV || 'development',
			file = path.join(cwd, 'cache', env, 'fermat/FermatManifest.xml');
		fs.lstat(file, function (err, stats) {
			if (!err && stats.isFile()) {
				// Yes it is
				//winston.log('info', 'Read Cache FermatManifest.xml %s', file);
				fs.readFile(file, function (err_read, res_read) {
					if (err_read) {
						return callback(err_read, null);
					}
					parseString(res_read, function (err_par, res_par) {
						if (err_par) {
							return callback(err_par, null);
						}
						return callback(null, res_par);
					});
				});
			} else {
				if (err) {
					winston.log('error', err.message, err);
				}*/
		doRequest('GET', 'https://api.github.com/repos/Fermat-ORG/fermat/contents/FermatManifest.xml', null, function (err_req, res_req) {
			if (err_req) {
				return callback(err_req, null);
			}
			processRequestBody(res_req, function (err_pro, res_pro) {
				if (err_pro) {
					return callback(err_pro, null);
				}
				if (res_pro.message && res_pro.message == 'Bad credentials') {
					return callback(new Error(res_pro.message), null);
				} else {
					var strCont = res_pro.split('\n').join(' ').split('\t').join(' ');
					parseString(strCont, function (err_par, res_par) {
						if (err_par) {
							return callback(err_par, null);
						}
						return callback(null, res_par);
					});
				}
			});
		});
		/*}
		});*/
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [parseManifest description]
 * pasa el json obtenido a una estructura mas limpia
 * @method parseManifest
 *
 * @param  {Function}    callback [description]
 *
 * @return {[type]}      [description]
 */
var parseManifest = function (callback) {
	'use strict';
	try {
		var i, j, k, layers, _layers, layer, comps, depends, _depends, depend, steps, _steps, fermat, platfrms, _platfrms, platfrm, suprlays, _suprlays, suprlay, procs, _procs, _proc, _step, _next;
		getManifest(function (err_man, res_man) {
			if (err_man) {
				return callback(err_man, null);
			}
			fermat = {};
			platfrms = [];
			_platfrms = res_man.fermat.platforms ? res_man.fermat.platforms[0].platform : [];
			for (i = 0; i < _platfrms.length; i++) {
				platfrm = {};
				platfrm = _platfrms[i]['$'];
				layers = [];
				_layers = _platfrms[i].layer || [];
				for (j = 0; j < _layers.length; j++) {
					layer = {};
					layer = _layers[j]['$'];
					comps = [];
					if (_layers[j].plugins) {
						comps = comps.concat(processCompList(platfrm, layer, _layers[j].plugins[0].plugin, 'plugin'));
					}
					if (_layers[j].androids) {
						comps = comps.concat(processCompList(platfrm, layer, _layers[j].androids[0].android, 'android'));
					}
					if (_layers[j].addons) {
						comps = comps.concat(processCompList(platfrm, layer, _layers[j].addons[0].addon, 'addon'));
					}
					if (_layers[j].libraries) {
						comps = comps.concat(processCompList(platfrm, layer, _layers[j].libraries[0].library, 'library'));
					}
					layer.comps = comps;
					layers.push(layer);
				}
				platfrm.layers = layers;
				depends = [];
				if (_platfrms[i].dependencies) {
					_depends = _platfrms[i].dependencies[0].dependency;
					for (j = 0; j < _depends.length; j++) {
						depend = {};
						depend = _depends[j]['$'];
						depends.push(depend);
					}
				}
				platfrm.depends = depends;
				platfrms.push(platfrm);
			}
			fermat.platfrms = platfrms;
			suprlays = [];
			_suprlays = res_man.fermat.super_layers ? res_man.fermat.super_layers[0].super_layer : [];
			for (i = 0; i < _suprlays.length; i++) {
				suprlay = {};
				suprlay = _suprlays[i]['$'];
				layers = [];
				_layers = _suprlays[i].layer;
				for (j = 0; j < _layers.length; j++) {
					layer = {};
					layer = _layers[j]['$'];
					comps = [];
					if (_layers[j].plugins) {
						comps = comps.concat(processCompList(suprlay, layer, _layers[j].plugins[0].plugin, 'plugin'));
					}
					if (_layers[j].androids) {
						comps = comps.concat(processCompList(suprlay, layer, _layers[j].androids[0].android, 'android'));
					}
					if (_layers[j].addons) {
						comps = comps.concat(processCompList(suprlay, layer, _layers[j].addons[0].addon, 'addon'));
					}
					if (_layers[j].libraries) {
						comps = comps.concat(processCompList(suprlay, layer, _layers[j].libraries[0].library, 'library'));
					}
					layer.comps = comps;
					layers.push(layer);
				}
				suprlay.layers = layers;
				depends = [];
				if (_suprlays[i].dependencies) {
					_depends = _suprlays[i].dependencies[0].dependency;
					for (j = 0; j < _depends.length; j++) {
						depend = {};
						depend = _depends[j]['$'];
						depends.push(depend);
					}
				}
				suprlay.depends = depends;
				suprlays.push(suprlay);
			}
			fermat.suprlays = suprlays;
			layers = [];
			_layers = res_man.fermat.layers ? res_man.fermat.layers[0].layer : [];
			for (i = 0; i < _layers.length; i++) {
				layer = {};
				layer = _layers[i]['$'];
				layers.push(layer);
			}
			fermat.layers = layers;
			procs = [];
			_procs = res_man.fermat.processes ? res_man.fermat.processes[0].process : [];
			for (i = 0; i < _procs.length; i++) {
				_proc = _procs[i]['$'];
				steps = [];
				_steps = _procs[i].steps ? _procs[i].steps[0].step : [];
				for (j = 0; j < _steps.length; j++) {
					_step = _steps[j]['$'];
					_step.next = [];
					if (_steps[j].next) {
						_next = _steps[j].next[0].step;
						if (_next) {
							for (k = 0; k < _next.length; k++) {
								_step.next.push(_next[k]['$']);
							}
						}
					}
					steps.push(_step);
				}
				_proc.steps = steps;
				procs.push(_proc);
			}
			fermat.procs = procs;
			return callback(null, fermat);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [getContent description]
 *Revisa los directorios del repositorio
 * @method getContent
 *
 * @param  {[type]}   repo_dir [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var getContent = function (repo_dir, callback) {
	'use strict';
	try {
		/*var cwd = process.cwd(),
			env = process.env.NODE_ENV || 'development',
			dir = path.join(cwd, 'cache', env, 'fermat', repo_dir); // exist = fs.lstatSync(dir);
		fs.lstat(dir, function (err, stats) {
			if (!err && stats.isDirectory()) {
				//winston.log('info', 'Read Cache Directory %s', dir);
				return callback(null, []);
			} else {*/
		doRequest('GET', 'https://api.github.com/repos/Fermat-ORG/fermat/contents/' + repo_dir, null, function (err_req, res_req) {
			if (err_req) {
				return callback(err_req, null);
			}
			processRequestBody(res_req, function (err_pro, res_pro) {
				if (err_pro) {
					return callback(err_pro, null);
				}
				return callback(null, res_pro);
			});
		});
		/*
					}
				});*/
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updateComps description]
 * Actualiza el repositorio en la base de datos
 * @method updateComps
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
var updateComps = function (callback) {
	'use strict';
	try {
		compMod.findComps(function (err_comps, res_comps) {
			if (err_comps) {
				return callback(err_comps, null);
			}
			if (res_comps && Array.isArray(res_comps)) {
				callback(null, {
					'update': true
				});
				var loopComps = function (i) {
					if (i < res_comps.length) {
						var _comp = res_comps[i];
						if (_comp.code_level !== 'concept') {
							getContent(_comp.repo_dir, function (err_dir, res_dir) {
								if (err_dir) {
									winston.log('error', err_dir.message, err_dir);
								} else {
									if (res_dir && Array.isArray(res_dir)) {
										compMod.insOrUpdComp(_comp._platfrm_id, // _platfrm_id
											_comp._suprlay_id, // _suprlay_id
											_comp._layer_id, // _layer_id
											_comp.name, // name
											null, // type
											null, // description
											null, // difficulty
											null, // code_level
											null, // repo_dir
											_comp.scrnshts, // scrnshts
											true, // found
											function (err_upd, res_upd) { // callback
												if (err_upd) {
													winston.log('error', err_upd.message, err_upd);
												} else {
													winston.log('debug', 'updating %s...', _comp._id + '...');
												}
											});
									}
								}
							});
						}
						loopComps(++i);
					} else {
						//winston.log('info', 'done iterating components');
						return callback(null, true);
					}
				};
				return loopComps(0);
			}
			return callback(new Error('no developers to iterate'), null);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [saveManifest description]
 * se encarga de recorrer el json generado por el parserManifest y lo guarda en la base de datos
 * @method saveManifest
 *
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
var saveManifest = function (callback) {
	'use strict';
	try {
		parseManifest(function (err_load, res_load) {
			if (err_load) {
				winston.log('error', err_load.message, err_load);
			} else {
				if (res_load.platfrms && Array.isArray(res_load.platfrms) && res_load.suprlays && Array.isArray(res_load.suprlays)) {
					var _platfrms = res_load.platfrms;
					var _suprlays = res_load.suprlays;
					var _procs = res_load.procs;
					var _lays = res_load.layers;
					//console.log("execute saveManifest");
					//console.log("define loopLays");
					var loopLays = function (u) {
						//console.log("execute loopLays");
						if (u < _lays.length) {
							var _lay = _lays[u];
							layerMod.insOrUpdLayer(_lay.name ? _lay.name.trim().toLowerCase() : null, _lay.language ? _lay.language.toLowerCase() : null, _lay.super_layer ? _lay.super_layer.trim().toUpperCase() : null, u, function (err_lay, res_lay) {
								if (err_lay) {
									winston.log('error', err_lay.message, err_lay);
								}
								loopLays(++u);
							});
						} else {
							updateComps(function (err_upd, res_upd) {
								if (err_upd) {
									winston.log('error', err_upd.message, err_upd);
								}
								//winston.log('info', 'done loading components');
								return;
							});
						}
					};
					//console.log("define loopProcs");
					var loopProcs = function (s) {
						//console.log("execute loopProcs");
						if (s < _procs.length) {
							var _proc = _procs[s];
							//platfrm, name, desc, prev, next, callback
							procMod.insOrUpdProc(_proc.platform ? _proc.platform.trim().toUpperCase() : null, //
								_proc.name ? _proc.name.trim() : null, //
								_proc.description ? _proc.description.trim() : null, //
								_proc.previous ? _proc.previous.trim() : null, //
								_proc.next ? _proc.next.trim() : null, //
								function (err_proc, res_proc) {
									if (err_proc) {
										winston.log('error', err_proc.message, err_proc);
										loopProcs(++s);
									} else {
										var _steps = _proc.steps;
										var loopSteps = function (t) {
											if (t < _steps.length) {
												var _step = _steps[t];
												procMod.insOrUpdStep(res_proc._id, //_proc_id
													_step.platform ? _step.platform.toUpperCase() : null, //platfrm_code
													_step.superlayer ? _step.superlayer.toUpperCase() : null, //suprlay_code
													_step.layer ? _step.layer.toLowerCase() : null, //layer_name
													_step.name ? _step.name.toLowerCase() : null, //comp_name
													_step.type ? _step.type.toLowerCase() : null, //type
													_step.title ? _step.title : null, //title
													_step.description ? _step.description : null, //description
													_step.id || null, //order
													_step.next || [], //next
													function (err_stp, res_stp) {
														if (err_stp) {
															winston.log('error', err_stp.message, err_stp);
															loopSteps(++t);
														} else {
															loopSteps(++t);
														}
													});
											} else {
												loopProcs(++s);
											}
										};
										loopSteps(0);
									}
								});
						} else {
							loopLays(0);
						}
					};
					//console.log("define loopSuprlays");
					var loopSuprlays = function (n) {
						//console.log("execute loopSuprlays");
						if (n < _suprlays.length) {
							var _suprlay = _suprlays[n];
							suprlayMod.insOrUpdSuprlay(_suprlay.code.trim().toUpperCase(), _suprlay.name.trim().toLowerCase(), _suprlay.logo, _suprlay.dependsOn ? _suprlay.dependsOn.split(' ').join('').split(',') : [], n, function (err_supr, res_supr) {
								if (err_supr) {
									winston.log('error', err_supr.message, err_supr);
									loopSuprlays(++n);
								} else {
									var _layers = _suprlay.layers;
									var loopLayers = function (o) {
										if (o < _layers.length) {
											var _layer = _layers[o];
											layerMod.insOrUpdLayer(_layer.name ? _layer.name.trim().toLowerCase() : null, _layer.language ? _layer.language.toLowerCase() : null, res_supr.code, -1, function (err_lay, res_lay) {
												if (err_lay) {
													winston.log('error', err_lay.message, err_lay);
													loopLayers(++o);
												} else if (res_lay) {
													var _comps = _layer.comps;
													var loopComps = function (p) {
														if (p < _comps.length) {
															var _comp = _comps[p];
															compMod.insOrUpdComp(null, // _platfrm_id
																res_supr._id, // _suprlay_id
																res_lay._id, // _layer_id
																_comp.name.trim().toLowerCase(), // name
																_comp.type.trim().toLowerCase(), // type
																_comp.description.trim().toLowerCase(), // description
																_comp.difficulty, // difficulty
																_comp['code-level'].trim().toLowerCase(), // code_level
																_comp.repo_dir, // repo_dir
																_comp.screenshots, // scrnshts
																null, // found
																function (err_comp, res_comp) { // callback
																	if (err_comp) {
																		winston.log('error', err_comp.message, err_comp);
																		loopComps(++p);
																	} else {
																		var _devs = _comp.devs;
																		var upd_devs = [];
																		var upd_life_cycle = [];
																		var loopDevs = function (q) {
																			if (q < _devs.length) {
																				var _dev = _devs[q];
																				if (_dev.name) {
																					devMod.insOrUpdDev(_dev.name.trim().toLowerCase(), null, null, null, null, null, null, null, function (err_dev, res_dev) {
																						if (err_dev) {
																							winston.log('error', err_dev.message, err_dev);
																							winston.log('error', err_dev.message, _dev);
																							loopDevs(++q);
																						} else {
																							compMod.insOrUpdCompDev(res_comp._id, res_dev._id, _dev.role, _dev.scope, _dev.percentage || '0', function (err_compDev, res_compDev) {
																								if (err_compDev) {
																									winston.log('error', err_compDev.message, err_compDev);
																									loopDevs(++q);
																								} else {
																									upd_devs.push(res_compDev._id);
																									loopDevs(++q);
																								}
																							});
																						}
																					});
																				} else {
																					loopDevs(++q);
																				}
																			} else {
																				var _life_cycle = _comp.life_cycle;
																				var loopLifeCycle = function (r) {
																					if (r < _life_cycle.length) {
																						var _status = _life_cycle[r];
																						compMod.insOrUpdStatus(res_comp._id, _status.name, _status.target, _status.reached, function (err_sta, res_sta) {
																							if (err_sta) {
																								winston.log('error', err_sta.message, err_sta);
																								loopLifeCycle(++r);
																							} else {
																								upd_life_cycle.push(res_sta._id);
																								loopLifeCycle(++r);
																							}
																						});
																					} else {
																						compMod.updCompDevAndLifCyc(res_comp._id, upd_devs, upd_life_cycle, function (err_upd, res_upd) {
																							if (err_upd) {
																								loopComps(++p);
																							} else {
																								loopComps(++p);
																							}
																						});
																					}
																				};
																				loopLifeCycle(0);
																			}
																		};
																		loopDevs(0);
																	}
																});
														} else {
															loopLayers(++o);
														}
													};
													loopComps(0);
												} else {
													loopLayers(++o);
												}
											});
										} else {
											loopSuprlays(++n);
										}
									};
									loopLayers(0);
								}
							});
						} else {
							return loopProcs(0);
						}
					};
					//console.log("define loopPlatfrms");
					var loopPlatfrms = function (i) {
						//console.log("execute loopPlatfrms");
						if (i < _platfrms.length) {
							var _platfrm = _platfrms[i];
							platfrmMod.insOrUpdPlatfrm(_platfrm.code.trim().toUpperCase(), _platfrm.name.trim().toLowerCase(), _platfrm.logo, _platfrm.dependsOn ? _platfrm.dependsOn.split(' ').join('').split(',') : [], i, function (err_plat, res_plat) {
								if (err_plat) {
									winston.log('error', err_plat.message, err_plat);
									loopPlatfrms(++i);
								} else {
									var _layers = _platfrm.layers;
									var loopLayers = function (j) {
										if (j < _layers.length) {
											var _layer = _layers[j];
											layerMod.insOrUpdLayer(_layer.name ? _layer.name.trim().toLowerCase() : null, _layer.language ? _layer.language.toLowerCase() : null, null, -1, function (err_lay, res_lay) {
												if (err_lay) {
													winston.log('error', err_lay.message, err_lay);
													loopLayers(++j);
												} else if (res_lay) {
													var _comps = _layer.comps;
													var loopComps = function (k) {
														if (k < _comps.length) {
															var _comp = _comps[k];
															compMod.insOrUpdComp(res_plat._id, // _platfrm_id
																null, // _suprlay_id
																res_lay._id, // _layer_id
																_comp.name.trim().toLowerCase(), // name
																_comp.type.trim().toLowerCase(), // type
																_comp.description.trim().toLowerCase(), // description
																_comp.difficulty, // difficulty
																_comp['code-level'].trim().toLowerCase(), // code_level
																_comp.repo_dir, // repo_dir
																_comp.screenshots, // scrnshts
																null, // found
																function (err_comp, res_comp) { // callback
																	if (err_comp) {
																		winston.log('error', err_comp.message, err_comp);
																		loopComps(++k);
																	} else {
																		var _devs = _comp.devs;
																		var upd_devs = [];
																		var upd_life_cycle = [];
																		var loopDevs = function (l) {
																			if (l < _devs.length) {
																				var _dev = _devs[l];
																				if (_dev.name) {
																					devMod.insOrUpdDev(_dev.name.trim().toLowerCase(), null, null, null, null, null, null, null, function (err_dev, res_dev) {
																						if (err_dev) {
																							winston.log('error', err_dev.message, err_dev);
																							winston.log('error', err_dev.message, _dev);
																							loopDevs(++l);
																						} else {
																							compMod.insOrUpdCompDev(res_comp._id, res_dev._id, _dev.role, _dev.scope, _dev.percentage || '0', function (err_compDev, res_compDev) {
																								if (err_compDev) {
																									winston.log('error', err_compDev.message, err_compDev);
																									loopDevs(++l);
																								} else {
																									upd_devs.push(res_compDev._id);
																									loopDevs(++l);
																								}
																							});
																						}
																					});
																				} else {
																					loopDevs(++l);
																				}
																			} else {
																				var _life_cycle = _comp.life_cycle;
																				var loopLifeCycle = function (m) {
																					if (m < _life_cycle.length) {
																						var _status = _life_cycle[m];
																						compMod.insOrUpdStatus(res_comp._id, _status.name, _status.target, _status.reached, function (err_sta, res_sta) {
																							if (err_sta) {
																								winston.log('error', err_sta.message, err_sta);
																								loopLifeCycle(++m);
																							} else {
																								upd_life_cycle.push(res_sta._id);
																								loopLifeCycle(++m);
																							}
																						});
																					} else {
																						compMod.updCompDevAndLifCyc(res_comp._id, upd_devs, upd_life_cycle, function (err_upd, res_upd) {
																							if (err_upd) {
																								loopComps(++k);
																							} else {
																								loopComps(++k);
																							}
																						});
																					}
																				};
																				loopLifeCycle(0);
																			}
																		};
																		loopDevs(0);
																	}
																});
														} else {
															loopLayers(++j);
														}
													};
													loopComps(0);
												} else {
													loopLayers(++j);
												}
											});
										} else {
											loopPlatfrms(++i);
										}
									};
									loopLayers(0);
								}
							});
						} else {
							return loopSuprlays(0);
						}
					};
					//console.log("define callback");
					callback(null, {
						'save': true
					});
					// deleting previous database
					//console.log("deleting previous database");
					procMod.delAllProcs(function (err_del, res_del) {
						//winston.log('info', 'deleting proccess...');
						if (err_del) {
							winston.log('error', err_del.message, err_del);
						}
						compMod.delAllComps(function (err_del, res_del) {
							//winston.log('info', 'deleting components...');
							if (err_del) {
								winston.log('error', err_del.message, err_del);
							}
							layerMod.delAllLayers(function (err_del, res_del) {
								//winston.log('info', 'deleting layers...');
								if (err_del) {
									winston.log('error', err_del.message, err_del);
								}
								suprlayMod.delAllSuprlays(function (err_del, res_del) {
									//winston.log('info', 'deleting superlayers...');
									if (err_del) {
										winston.log('error', err_del.message, err_del);
									}
									platfrmMod.delAllPlatfrms(function (err_del, res_del) {
										//winston.log('info', 'deleting platforms...');
										if (err_del) {
											winston.log('error', err_del.message, err_del);
										}
										//console.log("define loopPlatfrms(0)");
										return loopPlatfrms(0);
									});
								});
							});
						});
					});
				} else {
					//console.log("not saveManifest");
					return callback(null, {
						'save': false
					});
				}
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [getUser description]
 *Obtiene la informacion del usuario de github
 * @method getUser
 *
 * @param  {[type]}   usrnm    [description]
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var getUser = function (usrnm, callback) {
	'use strict';
	try {
		doRequest('GET', 'https://api.github.com/users/' + usrnm, null, function (err_req, res_req) {
			if (err_req) {
				return callback(err_req, null);
			}
			processRequestBody(res_req, function (err_pro, res_pro) {
				if (err_pro) {
					return callback(err_pro, null);
				}
				return callback(null, res_pro);
			});
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updateDevs description]
 *actualiza la informacion del developer en la base de datos
 * @method updateDevs
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
var updateDevs = function (callback) {
	'use strict';
	devMod.getDevs(function (err_devs, res_devs) {
		if (err_devs) {
			return callback(err_devs, null);
		}
		if (res_devs && Array.isArray(res_devs)) {
			callback(null, {
				'update': true
			});
			var loopDevs = function (i) {
				if (i < res_devs.length) {
					var _dev = res_devs[i];
					getUser(_dev.usrnm, function (err_usr, res_usr) {
						if (err_usr) {
							winston.log('error', err_usr.message, err_usr);
							loopDevs(++i);
						} else if (res_usr) {
							if (res_usr.message && res_usr.message == 'Bad credentials') {
								err_usr = new Error(res_usr.message);
								winston.log('error', err_usr.message, err_usr);
							} else {
								devMod.insOrUpdDev(_dev.usrnm, res_usr.email || null, res_usr.name || null, null, res_usr.location || null, res_usr.avatar_url || null, res_usr.html_url || null, res_usr.bio || null, function (err_upd, res_upd) {
									if (err_upd) {
										winston.log('error', err_upd.message, err_upd);
									}
								});
							}
						}
					});
					loopDevs(++i);
				} else {
					//winston.log('info', 'done loading users');
					return;
				}
			};
			return loopDevs(0);
		}
		return callback(new Error('no developers to iterate'), null);
	});
};
/**
 * [updateProcs description]
 *
 * @method updateProcs
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
var updateProcs = function (callback) {
	try {
		parseManifest(function (err_load, res_load) {
			if (err_load) {
				winston.log('error', err_load.message, err_load);
			} else {
				if (res_load.platfrms && Array.isArray(res_load.platfrms) && res_load.suprlays && Array.isArray(res_load.suprlays)) {
					var _procs = res_load.procs;
					var loopProcs = function (s) {
						//console.log("execute loopProcs");
						if (s < _procs.length) {
							var _proc = _procs[s];
							//platfrm, name, desc, prev, next, callback
							procMod.insOrUpdProc(_proc.platform ? _proc.platform.trim().toUpperCase() : null, //
								_proc.name ? _proc.name.trim() : null, //
								_proc.description ? _proc.description.trim() : null, //
								_proc.previous ? _proc.previous.trim() : null, //
								_proc.next ? _proc.next.trim() : null, //
								function (err_proc, res_proc) {
									if (err_proc) {
										winston.log('error', err_proc.message, err_proc);
										loopProcs(++s);
									} else {
										var _steps = _proc.steps;
										var loopSteps = function (t) {
											if (t < _steps.length) {
												var _step = _steps[t];
												procMod.insOrUpdStep(res_proc._id, //_proc_id
													_step.platform ? _step.platform.toUpperCase() : null, //platfrm_code
													_step.superlayer ? _step.superlayer.toUpperCase() : null, //suprlay_code
													_step.layer ? _step.layer.toLowerCase() : null, //layer_name
													_step.name ? _step.name.toLowerCase() : null, //comp_name
													_step.type ? _step.type.toLowerCase() : null, //type
													_step.title ? _step.title : null, //title
													_step.description ? _step.description : null, //description
													_step.id || null, //order
													_step.next || [], //next
													function (err_stp, res_stp) {
														if (err_stp) {
															winston.log('error', err_stp.message, err_stp);
															loopSteps(++t);
														} else {
															loopSteps(++t);
														}
													});
											} else {
												loopProcs(++s);
											}
										};
										loopSteps(0);
									}
								});
						} else {
							winston.log('info', 'loop proccess ended');
						}
					};
					loopProcs(0);
				} else {
					//console.log("not saveManifest");
					return callback(null, {
						'save': false
					});
				}
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updComps description]
 *
 * @method updComps
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.updComps = function (callback) {
	'use strict';
	try {
		updateComps(function (err, res) {
			if (err) {
				return callback(err, null);
			}
			if (res) {
				return callback(null, res);
			}
			return callback(null, null);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updDevs description]
 *
 * @method updDevs
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.updDevs = function (callback) {
	'use strict';
	try {
		updateDevs(function (err, res) {
			if (err) {
				return callback(err, null);
			}
			if (res) {
				return callback(null, res);
			}
			return callback(null, null);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updProcs description]
 *
 * @method updProcs
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.updProcs = function (callback) {
	'use strict';
	try {
		updateProcs(function (err, res) {
			if (err) {
				return callback(err, null);
			}
			if (res) {
				return callback(null, res);
			}
			return callback(null, null);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [loadComps description]
 *
 * @method loadComps
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.loadComps = function (callback) {
	'use strict';
	try {
		saveManifest(function (err, res) {
			if (err) {
				return callback(err, null);
			}
			if (res) {
				return callback(null, res);
			}
			return callback(null, null);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/*jshint +W069 */