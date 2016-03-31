/*jshint -W069 */
var winston = require('winston');
var stepSrv = require('./services/step');
var StepMdl = require('./models/step');
var procSrv = require('./services/proc');
var ProcMdl = require('./models/proc');
var platfrmSrv = require('../platform/services/platfrm');
var suprlaySrv = require('../superlayer/services/suprlay');
var layerSrv = require('../layer/services/layer');
var compSrv = require('../component/services/comp');
var orderLib = require('../../../lib/utils/order');
/**
 * [sort description]
 *
 * @method sort
 *
 * @param  {[type]} point [description]
 * @param  {[type]} dir   [description]
 *
 * @return {[type]} [description]
 */
/*var swapOrder = function (action, oldSpot, newSpot, callback) {
	orderLib.swapOrder(action, oldSpot, newSpot, function (err, query, set) {
		if (err) {
			return callback(err, null);
		} else {
			stepSrv.updateSteps(query, set, function (err_srt, res_srt) {
				if (err_srt) {
					return callback(err_srt, null);
				} else {
					return callback(null, res_srt);
				}
			});
		}
	});
};*/
/**
 * [findComp description]
 *
 * @method findComp
 *
 * @param  {[type]}   platfrm_code [description]
 * @param  {[type]}   suprlay_code [description]
 * @param  {[type]}   layer_name   [description]
 * @param  {[type]}   comp_name    [description]
 * @param  {Function} callback     [description]
 *
 * @return {[type]}   [description]
 */
var findComp = function (platfrm_code, suprlay_code, layer_name, comp_name, callback) {
	'use strict';
	try {
		layerSrv.findLayerByName(layer_name.toLowerCase(), function (err_lay, res_lay) {
			if (err_lay) {
				return callback(err_lay, null);
			}
			if (res_lay) {
				if (platfrm_code) {
					platfrmSrv.findPlatfrmByCode(platfrm_code, function (err_pla, res_pla) {
						if (err_pla) {
							return callback(err_pla, null);
						}
						if (res_pla) {
							compSrv.findComp({
								_layer_id: res_lay._id,
								name: comp_name,
								_platfrm_id: res_pla._id
							}, function (err_comp, res_comp) {
								if (err_comp) {
									return callback(err_comp, null);
								}
								return callback(null, res_comp);
							});
						} else {
							return callback(null, null);
						}
					});
				} else if (suprlay_code) {
					suprlaySrv.findSuprlayByCode(suprlay_code, function (err_sup, res_sup) {
						if (err_sup) {
							return callback(err_sup, null);
						}
						if (res_sup) {
							compSrv.findComp({
								_layer_id: res_lay._id,
								name: comp_name,
								_suprlay_id: res_sup._id
							}, function (err_comp, res_comp) {
								if (err_comp) {
									return callback(err_comp, null);
								}
								return callback(null, res_comp);
							});
						} else {
							return callback(null, null);
						}
					});
				} else {
					return callback(new Error('invalid search'), null);
				}
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		callback(err, null);
	}
};
/**
 * [findProcsByComp description]
 *
 * @method findProcsByComp
 *
 * @param  {[type]}        platfrm_code [description]
 * @param  {[type]}        suprlay_code [description]
 * @param  {[type]}        layer_name   [description]
 * @param  {[type]}        comp_name    [description]
 * @param  {Function}      callback     [description]
 *
 * @return {[type]}        [description]
 */
exports.findProcsByComp = function (platfrm_code, suprlay_code, layer_name, comp_name, callback) {
	'use strict';
	try {
		findComp(platfrm_code, suprlay_code, layer_name, comp_name, function (err_comp, res_comp) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			stepSrv.findSteps({
				_comp_id: res_comp._id
			}, {}, function (err, steps) {
				if (err) {
					return callback(err, null);
				}
				var _procs = [];
				/**
				 * [contains description]
				 *
				 * @method contains
				 *
				 * @param  {[type]} _id [description]
				 *
				 * @return {[type]} [description]
				 */
				_procs.contains = function (_id) {
					var i;
					for (i = this.length - 1; i >= 0; i--) {
						if (this[i]._id + ' ' === _id + ' ') {
							return true;
						}
					}
					return false;
				};
				var loopSteps = function (i) {
					if (i < steps.length) {
						var _step = steps[i];
						if (_procs.contains(_step._proc_id)) {
							loopSteps(++i);
						} else {
							procSrv.findAndPopulateProc({
								_id: _step._proc_id
							}, function (err_proc, res_proc) {
								if (err_proc) {
									loopSteps(++i);
								} else {
									_procs.push(res_proc);
									loopSteps(++i);
								}
							});
						}
					} else {
						callback(null, _procs);
					}
				};
				loopSteps(0);
			});
		});
	} catch (err) {
		callback(err, null);
	}
};
/**
 * [findStepsByProc description]
 *
 * @method findStepsByProc
 *
 * @param  {[type]}        platfrm   [description]
 * @param  {[type]}        proc_name [description]
 * @param  {Function}      callback  [description]
 *
 * @return {[type]}        [description]
 */
exports.findStepsByProc = function (platfrm, proc_name, callback) {
	'use strict';
	try {
		procSrv.findAndPopulateProc({
			platfrm: platfrm.toUpperCase(),
			name: proc_name.toLowerCase()
		}, function (err, res) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, res);
		});
	} catch (err) {
		callback(err, null);
	}
};
/**
 * [insOrUpdProc description]
 *
 * @method insOrUpdProc
 *
 * @param  {[type]}     platfrm  [description]
 * @param  {[type]}     name     [description]
 * @param  {[type]}     desc     [description]
 * @param  {[type]}     prev     [description]
 * @param  {Function}   next     [description]
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.insOrUpdProc = function (platfrm, name, desc, prev, next, callback) {
	'use strict';
	try {
		//console.dir(arguments);
		var find_obj = {
			'$and': []
		};
		if (platfrm) {
			find_obj['$and'].push({
				"platfrm": platfrm
			});
		}
		if (name) {
			find_obj['$and'].push({
				"name": name
			});
		}
		procSrv.findProc(find_obj, function (err_proc, res_proc) {
			if (err_proc) {
				return callback(err_proc, null);
			}
			if (res_proc) {
				var set_obj = {};
				if (desc !== res_proc.desc) {
					set_obj.desc = desc;
					res_proc.desc = desc;
				}
				if (prev !== res_proc.prev) {
					set_obj.prev = prev;
					res_proc.prev = prev;
				}
				if (next !== res_proc.next) {
					set_obj.next = next;
					res_proc.next = next;
				}
				if (Object.keys(set_obj).length > 0) {
					procSrv.updateProcById(res_proc._id, set_obj, function (err_upd, res_upd) {
						if (err_upd) {
							return callback(err_upd, null);
						}
						return callback(null, res_proc);
					});
				} else {
					return callback(null, res_proc);
				}
			} else {
				var proc = new ProcMdl(platfrm, name, desc, prev, next, []);
				procSrv.insertProc(proc, function (err_ins, res_ins) {
					if (err_ins) {
						return callback(err_ins, null);
					}
					return callback(null, res_ins);
				});
			}
		});
	} catch (err) {
		callback(err, null);
	}
};
/**
 * [findProcById description]
 *
 * @method findProcById
 *
 * @param  {[type]}     _id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findProcById = function (_id, callback) {
	'use strict';
	try {
		procSrv.findProcById(_id, function (err_proc, res_proc) {
			if (err_proc) {
				return callback(err_proc, null);
			} else if (res_proc) {
				return callback(null, res_proc);
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		callback(err, null);
	}
};
/**
 * [delProcById description]
 *
 * @method delProcById
 *
 * @param  {[type]}     _id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.delProcById = function (_id, callback) {
	'use strict';
	try {
		procSrv.findProcById(_id, function (err_proc, res_proc) {
			if (err_proc) {
				return callback(err_proc, null);
			}
			if (res_proc) {
				var steps = res_proc.steps;
				var loopDelSteeps = function () {
					if (steps.length <= 0) {
						procSrv.delProcById(_id, function (err_del_proc, res_del_proc) {
							if (err_del_proc) {
								return callback(err_del_proc, null);
							}
							return callback(null, res_del_proc);
						});
					} else {
						var _idStep = steps.pop();
						stepSrv.delStepById(_idStep, function (err_del_step, res_del_step) {
							if (err_del_step) {
								return callback(err_del_step, null);
							} else {
								loopDelSteeps();
							}
						});
					}
				};
				loopDelSteeps();
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		callback(err, null);
	}
};
/**
 * [insOrUpdStep description]
 *
 * @method insOrUpdStep
 *
 * @param  {[type]}     _proc_id     [description]
 * @param  {[type]}     platfrm_code [description]
 * @param  {[type]}     suprlay_code [description]
 * @param  {[type]}     layer_name   [description]
 * @param  {[type]}     comp_name    [description]
 * @param  {[type]}     type         [description]
 * @param  {[type]}     title        [description]
 * @param  {[type]}     desc         [description]
 * @param  {[type]}     order        [description]
 * @param  {Function}   next         [description]
 * @param  {Function}   callback     [description]
 *
 * @return {[type]}     [description]
 */
exports.insOrUpdStep = function (_proc_id, platfrm_code, suprlay_code, layer_name, comp_name, type, title, desc, order, next, callback) {
	'use strict';
	try {
		findComp(platfrm_code, suprlay_code, layer_name, comp_name, function (err_comp, res_comp) {
			if (err_comp) {
				winston.log('info', 'component not found');
			}
			var find_obj = {
				'$and': []
			};
			if (_proc_id) {
				find_obj['$and'].push({
					'_proc_id': _proc_id
				});
			}
			if (order) {
				find_obj['$and'].push({
					'order': order
				});
			} else {
				order = 0;
				find_obj['$and'].push({
					'order': order
				});
			}
			var _comp_id = res_comp && res_comp._id ? res_comp._id : null;
			stepSrv.findStep(find_obj, function (err_step, res_step) {
				if (err_step) {
					return callback(err_step, null);
				}
				if (res_step) {
					var set_obj = {};
					if (_comp_id && _comp_id !== res_step._comp_id) {
						set_obj._comp_id = _comp_id;
						res_step._comp_id = _comp_id;
					}
					if (type && type !== res_step.type) {
						set_obj.type = type;
						res_step.type = type;
					}
					if (title && title !== res_step.title) {
						set_obj.title = title;
						res_step.title = title;
					}
					if (desc && desc !== res_step.desc) {
						set_obj.desc = desc;
						res_step.desc = desc;
					}
					if (next && next !== res_step.next) {
						set_obj.next = next;
						res_step.next = next;
					}
					if (Object.keys(set_obj).length > 0) {
						//if (typeof set_obj.order != 'undefined' && set_obj.order > -1) {
						//	swapOrder('update', res_step.order, set_obj.order, function (err_sld, res_sld) {
						//		if (err_sld) {
						//			return callback(err_sld, null);
						//		} else {
						//			stepSrv.updateStepById(res_step._id, set_obj, function (err_upd, res_upd) {
						//				if (err_upd) {
						//					return callback(err_upd, null);
						//				}
						//				return callback(null, set_obj);
						//			});
						//		}
						//	});
						//} else {
						stepSrv.updateStepById(res_step._id, set_obj, function (err_upd, res_upd) {
							if (err_upd) {
								return callback(err_upd, null);
							}
							return callback(null, set_obj);
						});
						//}
					} else {
						return callback(null, res_step);
					}
				} else {
					var step = new StepMdl(_proc_id, res_comp ? res_comp._id : null, type, title, desc, order, next);
					//swapOrder('insert', null, step.order, function (err_sld, res_sld) {
					//	if (err_sld) {
					//		return callback(err_sld, null);
					//	} else {
					stepSrv.insertStep(step, function (err_ins, res_ins) {
						if (err_ins) {
							return callback(err_ins, null);
						}
						return callback(null, res_ins);
					});
					//	}
					//});
				}
			});
		});
	} catch (err) {
		callback(err, null);
	}
};
/**
 * [getAllProces description]
 *
 * @method getAllProces
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getAllProces = function (callback) {
	'use strict';
	try {
		procSrv.findAllProcs({}, {}, function (err, procs) {
			if (err) {
				return callback(err, null);
			}
			console.log("en el getAllProces");
			console.log(procs);
			var loopProcs = function (j) {
				if (j < procs.length) {
					var _proc = procs[j];
					stepSrv.findSteps({
						_proc_id: _proc._id
					}, {}, function (err, steps) {
						if (err) {
							return callback(err, null);
						}
						var _procs = [];
						var _steps = [];
						/**
						 * [contains description]
						 *
						 * @method contains
						 *
						 * @param  {[type]} _id [description]
						 *
						 * @return {[type]} [description]
						 */
						_procs.contains = function (_id) {
							var i;
							for (i = this.length - 1; i >= 0; i--) {
								if (this[i]._id + ' ' === _id + ' ') {
									return true;
								}
							}
							return false;
						};
						var loopSteps = function (i) {
							if (i < steps.length) {
								var _step = steps[i];
								if (_procs.contains(_step._proc_id)) {
									loopSteps(++i);
								} else {
									procSrv.findAndPopulateProc({
										_id: _step._proc_id
									}, function (err_proc, res_proc) {
										if (err_proc) {
											loopSteps(++i);
										} else {
											_procs.push(res_proc);
											_steps = res_proc.steps;
											loopSteps(++i);
										}
									});
								}
							} else {
								procs[j].steps = _steps;
								loopProcs(++j);
							}
						};
						loopSteps(0);
					});
				} else {
					return callback(null, procs);
				}
			};
			loopProcs(0);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delAllProcs description]
 *
 * @method delAllProcs
 *
 * @param  {Function}  callback [description]
 *
 * @return {[type]}    [description]
 */
exports.delAllProcs = function (callback) {
	'use strict';
	try {
		stepSrv.delAllSteps(function (err, steps) {
			console.log("deleting all steps");
			if (err) {
				return callback(err, null);
			}
			procSrv.delAllProcs(function (err, procs) {
				console.log("deleting all procs");
				if (err) {
					return callback(err, null);
				}
				console.log("deleted all steps");
				return callback(null, true);
			});
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updateProcById description]
 *
 * @method updateProcById
 *
 *
 * @param  {[type]}     _proc_id        [description]
 * @param  {[type]}     platfrm         [description]
 * @param  {[type]}     name            [description]
 * @param  {[type]}     desc            [description]
 * @param  {[type]}     prev            [description]
 * @param  {[type]}     next            [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.updateProcById = function (_proc_id, platfrm, name, desc, prev, next, callback) {
	'use strict';
	try {
		var set_obj = {};
		if (platfrm) {
			set_obj.platfrm = platfrm;
		}
		if (name) {
			set_obj.name = name;
		}
		if (desc) {
			set_obj.desc = desc;
		}
		if (prev) {
			set_obj.prev = prev;
		}
		if (next) {
			set_obj.next = next;
		}
		procSrv.updateProcById(_proc_id, set_obj, function (err, proc) {
			if (err) {
				return callback(err, null);
			} else if (proc.n > 0) {
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
 * [findProcById description]
 *
 * @method findProcById
 *
 * @param  {[type]}     _id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findProcById = function (_id, callback) {
	'use strict';
	try {
		procSrv.findProcById(_id, function (err_lay, res_lay) {
			console.log(arguments);
			if (err_lay) {
				return callback(err_lay, null);
			}
			return callback(null, res_lay);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [insertStep description]
 *
 * @method insertStep
 *
 *
 * @param  {[type]}     _proc_id        [description]
 * @param  {[type]}     _comp_id        [description]
 * @param  {[type]}     type            [description]
 * @param  {[type]}     title           [description]
 * @param  {[type]}     desc            [description]
 * @param  {[type]}     order           [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.insertStep = function (_proc_id, _comp_id, type, title, desc, order, next, callback) {
	'use strict';
	try {
		procSrv.findProcById(_proc_id, function (err_proc, res_proc) {
			if (err_proc) {
				return callback(err_proc, null);
			} else if (res_proc) {
				var step = new StepMdl(_proc_id, _comp_id, type, title, desc, order, next);
				stepSrv.insertStep(step, function (err_ins, res_ins) {
					if (err_ins) {
						return callback(err_ins, null);
					}
					procSrv.pushStepToProcById(_proc_id, res_ins._id, function (err_push_step, res_push_step) {
						if (err_push_step) {
							return callback(err_push_step, null);
						}
						return callback(null, res_ins);
					});
				});
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [updateStepById description]
 *
 * @method updateStepById
 *
 * @param  {[type]}     _step_id        [description]
 * @param  {[type]}     _comp_id        [description]
 * @param  {[type]}     type            [description]
 * @param  {[type]}     title           [description]
 * @param  {[type]}     desc            [description]
 * @param  {[type]}     order           [description]
 * @param  {[type]}     next           [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.updateStepById = function (_step_id, _comp_id, type, title, desc, order, next, callback) {
	'use strict';
	try {
		var set_obj = {};
		if (_comp_id) {
			set_obj._comp_id = _comp_id;
		}
		if (type) {
			set_obj.type = type;
		}
		if (title) {
			set_obj.title = title;
		}
		if (desc) {
			set_obj.desc = desc;
		}

		if (typeof order != "undefined") {
			set_obj.order = order;
		}

		if(typeof next != "undefined") {
			set_obj.next = next;
		}

		stepSrv.findStepById(_step_id, function (err_step, res_step) {
			if (err_step) {
				return callback(err_step, null);
			} else if (res_step) {
				//if (typeof set_obj.order != 'undefined' && set_obj.order > -1) {
				//    swapOrder('update', res_step.order, set_obj.order, function (err_sld, res_sld) {
				//    	  if (err_sld) {
				//    		  return callback(err_sld, null);
				//    	  } else {
				//    		  stepSrv.updateStepById(_step_id, set_obj, function (err_upt, step) {
				//    		  	  if (err_upt) {
				//    		  	  	  return callback(err_upt, null);
				//    		  	  }
				//    		  	  return callback(null, set_obj);
				//    		  });
				//    	  }
				//    });
				//} else {
				stepSrv.updateStepById(_step_id, set_obj, function (err_upt, step) {
					if (err_upt) {
						return callback(err_upt, null);
					}
					return callback(null, set_obj);
				});
				//}
			} else {
				return callback(null, null);
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delStepById description]
 *
 * @method delStepById
 *
 * @param  {[type]}     _id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.delStepById = function (_id, callback) {
	'use strict';
	try {
		stepSrv.findStepById(_id, function (err_step, res_step) {
			if (err_step) {
				return callback(err_step, null);
			}
			// ordering function
			//swapOrder('delete', res_step.order, null, function (err_sld, res_sld) {
			//	if (err_sld) {
			//		return callback(err_sld, null);
			//	} else {
			stepSrv.delStepById(res_step._id, function (err_del, res_del) {
				if (err_del) {
					return callback(err_del, null);
				}
				return callback(null, res_step);
			});
			//	}
			//});
		});
	} catch (err) {
		return callback(err, null);
	}
};
/*jshint +W069 */