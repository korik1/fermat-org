/*jshint -W069 */
var compSrv = require('./services/comp');
var CompMdl = require('./models/comp');
var compDevSrv = require('./services/compDev');
var CompDevMdl = require('./models/compDev');
var statusSrv = require('./services/status');
var StatusMdl = require('./models/status');
/**
 * [getComps description]
 *
 * @method getComps
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getComps = function (callback) {
	'use strict';
	try {
		compSrv.findAllComps({}, {}, function (err, comps) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, comps);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [findComps description]
 *
 * @method findComps
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.findComps = function (callback) {
	'use strict';
	try {
		compSrv.findComps({}, {}, function (err, comps) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, comps);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [insOrUpdComp description]
 *
 * @method insOrUpdComp
 *
 * @param  {[type]}     _platfrm_id [description]
 * @param  {[type]}     _suprlay_id [description]
 * @param  {[type]}     _layer_id   [description]
 * @param  {[type]}     name        [description]
 * @param  {[type]}     type        [description]
 * @param  {[type]}     description [description]
 * @param  {[type]}     difficulty  [description]
 * @param  {[type]}     code_level  [description]
 * @param  {[type]}     repo_dir    [description]
 * @param  {[type]}     scrnshts     [description]
 * @param  {[type]}     found       [description]
 * @param  {Function}   callback    [description]
 *
 * @return {[type]}     [description]
 */
exports.insOrUpdComp = function (_platfrm_id, _suprlay_id, _layer_id, name, type, description, difficulty, code_level, repo_dir, scrnshts, found, callback) {
	'use strict';
	try {
		var find_obj = {
			'$and': []
		};
		if (_platfrm_id) {
			find_obj['$and'].push({
				'_platfrm_id': _platfrm_id
			});
		}
		if (_suprlay_id) {
			find_obj['$and'].push({
				'_suprlay_id': _suprlay_id
			});
		}
		if (_layer_id) {
			find_obj['$and'].push({
				'_layer_id': _layer_id
			});
		}
		if (name) {
			find_obj['$and'].push({
				'name': name
			});
		}
		compSrv.findComp(find_obj, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			} else if (res_comp) {
				var set_obj = {};
				if (type && type !== res_comp.type) {
					set_obj.type = type;
					res_comp.type = type;
				}
				if (description && description !== res_comp.description) {
					set_obj.description = description;
					res_comp.description = description;
				}
				if (difficulty && difficulty !== res_comp.difficulty) {
					set_obj.difficulty = difficulty;
					res_comp.difficulty = difficulty;
				}
				if (code_level && code_level !== res_comp.code_level) {
					set_obj.code_level = code_level;
					res_comp.code_level = code_level;
				}
				if (repo_dir && repo_dir !== res_comp.repo_dir) {
					set_obj.repo_dir = repo_dir;
					res_comp.repo_dir = repo_dir;
				}
				set_obj.scrnshts = scrnshts;
				res_comp.scrnshts = scrnshts;
				if (found && found !== res_comp.found) {
					set_obj.found = found;
					res_comp.found = found;
				}
				if (Object.keys(set_obj).length > 0) {
					compSrv.updateCompById(res_comp._id, set_obj, function (err_upd, res_upd) {
						if (err_upd) {
							return callback(err_upd, null);
						}
						return callback(null, res_comp);
					});
				} else {
					return callback(null, res_comp);
				}
			} else {
				var comp = new CompMdl(_platfrm_id, _suprlay_id, _layer_id, name, type, description, difficulty, code_level, repo_dir, scrnshts);
				compSrv.insertComp(comp, function (err_ins, res_ins) {
					if (err_ins) {
						return callback(err_ins, null);
					}
					return callback(null, res_ins);
				});
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [insOrUpdCompDev description]
 *
 * @method insOrUpdCompDev
 *
 * @param  {[type]}        _comp_id [description]
 * @param  {[type]}        _dev_id  [description]
 * @param  {[type]}        role     [description]
 * @param  {[type]}        scope    [description]
 * @param  {[type]}        percnt   [description]
 * @param  {Function}      callback [description]
 *
 * @return {[type]}        [description]
 */
exports.insOrUpdCompDev = function (_comp_id, _dev_id, role, scope, percnt, callback) {
	'use strict';
	try {
		var find_obj = {
			'$and': []
		};
		if (_comp_id) {
			find_obj['$and'].push({
				'_comp_id': _comp_id
			});
		}
		if (_dev_id) {
			find_obj['$and'].push({
				'_dev_id': _dev_id
			});
		}
		if (role) {
			find_obj['$and'].push({
				'role': role
			});
		}
		if (scope) {
			find_obj['$and'].push({
				'scope': scope
			});
		}
		compDevSrv.findCompDev(find_obj, function (err_compDev, res_compDev) {
			if (err_compDev) {
				return callback(err_compDev, null);
			}
			if (res_compDev) {
				var set_obj = {};
				if (percnt !== res_compDev.percnt) {
					set_obj.percnt = percnt;
					res_compDev.percnt = percnt;
				}
				if (Object.keys(set_obj).length > 0) {
					compDevSrv.updateCompDevById(res_compDev._id, set_obj, function (err_upd, res_upd) {
						if (err_upd) {
							return callback(err_upd, null);
						}
						return callback(null, res_compDev);
					});
				} else {
					return callback(null, res_compDev);
				}
			} else {
				var compDev = new CompDevMdl(_comp_id, _dev_id, role, scope, percnt);
				compDevSrv.insertCompDev(compDev, function (err_ins, res_ins) {
					if (err_ins) {
						return callback(err_ins, null);
					}
					return callback(null, res_ins);
				});
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [insOrUpdStatus description]
 *
 * @method insOrUpdStatus
 *
 * @param  {[type]}       _comp_id [description]
 * @param  {[type]}       name     [description]
 * @param  {[type]}       target   [description]
 * @param  {[type]}       reached  [description]
 * @param  {Function}     callback [description]
 *
 * @return {[type]}       [description]
 */
exports.insOrUpdStatus = function (_comp_id, name, target, reached, callback) {
	'use strict';
	try {
		var find_obj = {
			'$and': []
		};
		if (_comp_id) {
			find_obj['$and'].push({
				'_comp_id': _comp_id
			});
		}
		if (name) {
			find_obj['$and'].push({
				'name': name
			});
		}
		statusSrv.findStatus(find_obj, function (err_status, res_status) {
			if (err_status) {
				return callback(err_status, null);
			}
			if (res_status) {
				var set_obj = {};
				if (target !== res_status.target) {
					set_obj.target = target;
					res_status.target = target;
				}
				if (reached !== res_status.reached) {
					set_obj.reached = reached;
					res_status.reached = reached;
				}
				if (Object.keys(set_obj).length > 0) {
					statusSrv.updateStatusById(res_status._id, set_obj, function (err_upd, res_upd) {
						if (err_upd) {
							return callback(err_upd, null);
						}
						return callback(null, res_status);
					});
				} else {
					return callback(null, res_status);
				}
			} else {
				var status = new StatusMdl(_comp_id, name, target, reached);
				statusSrv.insertStatus(status, function (err_ins, res_ins) {
					if (err_ins) {
						return callback(err_ins, null);
					}
					return callback(null, res_ins);
				});
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updCompDevAndLifCyc description]
 *
 * @method updCompDevAndLifCyc
 *
 * @param  {[type]}            _comp_id   [description]
 * @param  {[type]}            devs       [description]
 * @param  {[type]}            life_cycle [description]
 * @param  {Function}          callback   [description]
 *
 * @return {[type]}            [description]
 */
exports.updCompDevAndLifCyc = function (_comp_id, devs, life_cycle, callback) {
	'use strict';
	try {
		compSrv.findCompById(_comp_id, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			if (res_comp) {
				var set_obj = {};
				if (devs !== res_comp.devs) {
					set_obj.devs = devs;
					res_comp.devs = devs;
				}
				if (life_cycle !== res_comp.life_cycle) {
					set_obj.life_cycle = life_cycle;
					res_comp.life_cycle = life_cycle;
				}
				if (Object.keys(set_obj).length > 0) {
					compSrv.updateCompById(res_comp._id, set_obj, function (err_upd, res_upd) {
						if (err_upd) {
							return callback(err_upd, null);
						}
						return callback(null, res_comp);
					});
				} else {
					return callback(null, res_comp);
				}
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [uptLifeCiclesById description]
 *
 * @method uptLifeCiclesById
 *
 * @param  {[type]}     _life_cicle_id  [description]
 * @param  {[type]}     target          [description]
 * @param  {[type]}     reached          [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.uptLifeCiclesById = function (_life_cicle_id, target, reached, callback) {
	'use strict';
	try {
		var set_obj = {};
		if (target) {
			set_obj.target = target;
		}
		if (reached) {
			set_obj.reached = reached;
		}
		statusSrv.updateStatusById(_life_cicle_id, set_obj, function (err_upd, res_upd) {
			if (err_upd) {
				return callback(err_upd, null);
			} else if (res_upd && res_upd.n > 0) {
				return callback(null, set_obj);
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [findCompById description]
 *
 * @method findCompById
 *
 * @param  {[type]}     _id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findCompById = function (_id, callback) {
	'use strict';
	try {
		compSrv.findAndPopulateCompById(_id, 'life_cycle devs', function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			return callback(null, res_comp);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [pushStatusToCompLifeCycleById description]
 *
 * @method pushStatusToCompLifeCycleById
 *
 * @param  {[type]}     _comp_id       [description]
 * @param  {[type]}     _status_id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.pushStatusToCompLifeCycleById = function (_comp_id, _status_id, callback) {
	'use strict';
	try {
		compSrv.pushStatusToCompLifeCycleById(_comp_id, _status_id, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			return callback(null, res_comp);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [findCompByLayerId description]
 *
 * @method findCompByLayerId
 *
 * @param  {[type]}     _layer_id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findCompsByLayerId = function (_layer_id, callback) {
	'use strict';
	try {
		var find_obj = {
			'$and': []
		};
		if (_layer_id) {
			find_obj['$and'].push({
				'_layer_id': _layer_id
			});
		}
		compSrv.findComps(find_obj, {}, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			return callback(null, res_comp);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [findCompsBySuprlayId description]
 *
 * @method findCompsBySuprlayId
 *
 * @param  {[type]}     _suprlay_id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findCompsBySuprlayId = function (_suprlay_id, callback) {
	'use strict';
	try {
		var find_obj = {
			'$and': []
		};
		if (_suprlay_id) {
			find_obj['$and'].push({
				'_suprlay_id': _suprlay_id
			});
		}
		compSrv.findComps(find_obj, {}, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			return callback(null, res_comp);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [findCompByPlatfrmId description]
 *
 * @method findCompByPlatfrmId
 *
 * @param  {[type]}     _platfrm_id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findCompsByPlatfrmId = function (_platfrm_id, callback) {
	'use strict';
	try {
		var find_obj = {
			'$and': []
		};
		if (_platfrm_id) {
			find_obj['$and'].push({
				'_platfrm_id': _platfrm_id
			});
		}
		compSrv.findComps(find_obj, {}, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			return callback(null, res_comp);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delAllComps description]
 *
 * @method delAllComps
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delAllComps = function (callback) {
	'use strict';
	try {
		compSrv.delAllComps(function (err, comps) {
			if (err) {
				return callback(err, null);
			}
			compDevSrv.delAllCompDevs(function (err, comp_devs) {
				if (err) {
					return callback(err, null);
				}
				statusSrv.delAllStatuses(function (err, statuses) {
					if (err) {
						return callback(err, null);
					}
					return callback(null, true);
				});
			});
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updateCompById description]
 *
 * @method updateCompById
 *
 *
 * @param  {[type]}     _comp_id        [description]
 * @param  {[type]}     _platfrm_id     [description]
 * @param  {[type]}     _suprlay_id     [description]
 * @param  {[type]}     _layer_id       [description]
 * @param  {[type]}     type            [description]
 * @param  {[type]}     description     [description]
 * @param  {[type]}     difficulty      [description]
 * @param  {[type]}     code_level      [description]
 * @param  {[type]}     repo_dir        [description]
 * @param  {[type]}     scrnshts        [description]
 * @param  {[type]}     found           [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.updateCompById = function (_comp_id, _platfrm_id, _suprlay_id, _layer_id, name, type, description, difficulty, code_level, repo_dir, scrnshts, found, callback) {
	'use strict';
	try {
		var set_obj = {};
		if (_platfrm_id || _platfrm_id === null) {
			set_obj._platfrm_id = _platfrm_id;
		}
		if (_suprlay_id || _suprlay_id === null) {
			set_obj._suprlay_id = _suprlay_id;
		}
		if (_layer_id) {
			set_obj._layer_id = _layer_id;
		}
		if (name) {
			set_obj.name = name;
		}
		if (type) {
			set_obj.type = type;
		}
		if (description) {
			set_obj.description = description;
		}
		if (difficulty) {
			set_obj.difficulty = difficulty;
		}
		if (code_level) {
			set_obj.code_level = code_level;
		}
		if (repo_dir) {
			set_obj.repo_dir = repo_dir;
		}
		if (typeof scrnshts != "undefined") {
			set_obj.scrnshts = scrnshts;
		}
		if (typeof found != "undefined") {
			set_obj.found = found;
		}
		compSrv.updateCompById(_comp_id, set_obj, function (err, comp) {
			if (err) {
				return callback(err, null);
			}
			if (comp && comp.n > 0) {
				return callback(null, set_obj);
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updateCompById description]
 *
 * @method updateCompById
 *
 * @param  {[type]}     _comp_dev_id    [description]
 * @param  {[type]}     _comp_id        [description]
 * @param  {[type]}     _dev_id         [description]
 * @param  {[type]}     role            [description]
 * @param  {[type]}     scope           [description]
 * @param  {[type]}     percnt          [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.updateCompDevById = function (_comp_dev_id, _comp_id, _dev_id, role, scope, percnt, callback) {
	'use strict';
	try {
		var set_obj = {};
		if (_comp_id) {
			set_obj._comp_id = _comp_id;
		}
		if (_dev_id) {
			set_obj._dev_id = _dev_id;
		}
		if (role) {
			set_obj.role = role;
		}
		if (scope) {
			set_obj.scope = scope;
		}
		if (percnt) {
			set_obj.percnt = percnt;
		}
		compDevSrv.updateCompDevById(_comp_dev_id, set_obj, function (err, comp_dev) {
			if (err) {
				return callback(err, null);
			} else if (comp_dev && comp_dev.n > 0) {
				return callback(null, set_obj);
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delCompById description]
 *
 * @method updateCompById
 *
 *
 * @param  {[type]}     _comp_id        [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.delCompById = function (_id, callback) {
	'use strict';
	try {
		compSrv.findCompById(_id, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			if (res_comp) {
				var comp_devs = res_comp.devs;
				var life_cicles = res_comp.life_cycle;
				var loopDelCompDevs = function () {
					if (comp_devs.length <= 0) {
						var loopDelLifeCicles = function () {
							if (life_cicles.length <= 0) {
								compSrv.delCompById(_id, function (err_del_comp, res_del_comp) {
									if (err_del_comp) {
										return callback(err_del_comp, null);
									}
									return callback(null, res_del_comp);
								});
							} else {
								var _id_status = life_cicles.pop();
								statusSrv.delStatusById(_id_status, function (err_del_status, res_del_status) {
									if (err_del_status) {
										return callback(err_del_status, null);
									} else {
										loopDelLifeCicles();
									}
								});
							}
						};
						loopDelLifeCicles();
					} else {
						var _id_comp_dev = comp_devs.pop();
						compDevSrv.delCompDevById(_id_comp_dev, function (err_del_comp_dev, res_del_comp_dev) {
							if (err_del_comp_dev) {
								return callback(err_del_comp_dev, null);
							} else {
								loopDelCompDevs();
							}
						});
					}
				};
				loopDelCompDevs();
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delCompDevById description]
 *
 * @method delCompDevById
 *
 *
 * @param  {[type]}     _comp_id        [description]
 * @param  {[type]}     _comp_dev_id        [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.delCompDevById = function (_comp_id, _comp_dev_id, callback) {
	'use strict';
	try {
		compDevSrv.delCompDevById(_comp_dev_id, function (err_comp_dev, res_comp_dev) {
			if (err_comp_dev) {
				return callback(err_comp_dev, null);
			} else if (res_comp_dev && res_comp_dev.result.n > 0) {
				compSrv.pullDevFromCompById(_comp_id, _comp_dev_id, function (err_pull, res_pull) {
					if (err_pull) {
						return callback(err_comp_dev, null);
					}
					return callback(null, res_pull);
				});
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/*jshint +W069 */