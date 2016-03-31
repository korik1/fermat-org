var libxml = require('libxmljs');
var lockMod = require('./lock');
var procMod = require('./process');
var compMod = require('./component');
var compServ = require('./component/services/comp');
var layerMod = require('./layer');
var suprlayMod = require('./superlayer');
var platfrmMod = require('./platform');
var docMod = require('./doc');
var devMod = require('./developer');
var loadMod = require('./lib/loader');
var syncMod = require('./lib/syncer');
/**
 * Get all components
 * @method getComps
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getComps = function (req, next) {
	'use strict';
	try {
		var res = {};
		platfrmMod.getPlatfrms(function (err, platfrms) {
			if (err) {
				next(err, null);
			} else {
				res.platfrms = platfrms;
				suprlayMod.getSuprlays(function (err, suprlays) {
					if (err) {
						next(err, null);
					} else {
						res.suprlays = suprlays;
						layerMod.getLayers(function (err, layers) {
							if (err) {
								next(err, null);
							} else {
								res.layers = layers;
								compMod.getComps(function (err, comps) {
									if (err) {
										next(err, null);
									} else {
										res.comps = comps;
										next(null, res);
									}
								});
							}
						});
					}
				});
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * Function to List Process filter by
 *
 * @method getProcs
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getProcs = function (req, next) {
	'use strict';
	try {
		var platfrm_code;
		if ((req.query.platform || req.query.superlayer) && req.query.layer && req.query.component) {
			platfrm_code = req.query.platform ? req.query.platform.toUpperCase() : null;
			var suprlay_code = req.query.superlayer ? req.query.superlayer.toUpperCase() : null,
				layer_name = req.query.layer ? req.query.layer.toLowerCase() : null,
				comp_name = req.query.component ? req.query.component.toLowerCase() : null;
			procMod.findProcsByComp(platfrm_code, suprlay_code, layer_name, comp_name, function (err, res) {
				if (err) {
					next(err, null);
				} else {
					next(null, res);
				}
			});
		} else if (req.query.platform && req.query.name) {
			platfrm_code = req.query.platform ? req.query.platform.toUpperCase() : null;
			var name = req.query.name ? req.query.name.toLowerCase() : null;
			procMod.findStepsByProc(platfrm_code, name, function (err, res) {
				if (err) {
					next(err, null);
				} else {
					next(null, res);
				}
			});
		} else {
			procMod.getAllProces(function (err, res) {
				if (err) {
					next(err, null);
				} else {
					next(null, res);
				}
			});
		}
	} catch (err) {
		next(err, null);
	}
};
/**
 * Gets the repository Readme
 * @method getReadme
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getReadme = function (req, next) {
	'use strict';
	try {
		docMod.getReadme(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * Gets the documentation repository
 * @method getBook
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getBook = function (req, next) {
	'use strict';
	try {
		docMod.getBook(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * Gets the documentation given a specific type
 *
 * @method getBook
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getDocs = function (req, next) {
	'use strict';
	try {
		var type = req.param('type');
		var style = req.query.style;
		if (type == 'book') {
			docMod.getBookPdf(style, function (err, res) {
				if (err) {
					next(err, null);
				} else {
					next(null, res);
				}
			});
		} else if (type == 'readme') {
			docMod.getReadmePdf(style, function (err, res) {
				if (err) {
					next(err, null);
				} else {
					next(null, res);
				}
			});
		} else if (type == 'paper') {
			docMod.getPaperPdf(style, function (err, res) {
				if (err) {
					next(err, null);
				} else {
					next(null, res);
				}
			});
		}
	} catch (err) {
		next(err, null);
	}
};
/**
 * [getDevs description]
 *
 * @method getDevs
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getDevs = function (req, next) {
	'use strict';
	try {
		devMod.getDevs(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * [loadComps description]
 *
 * @method loadComps
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.loadComps = function (req, next) {
	'use strict';
	try {
		loadMod.loadComps(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * [updComps description]
 *
 * @method updComps
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.updComps = function (req, next) {
	'use strict';
	try {
		loadMod.updComps(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * [updBook description]
 *
 * @method updBook
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.updBook = function (req, next) {
	'use strict';
	try {
		syncMod.getBook(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * [checkManifest description]
 *
 * @method checkManifest
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.checkManifest = function (req, next) {
	'use strict';
	try {
		loadMod.getManifestWithExt('xsd', function (err_xsd, res_xsd) {
			if (err_xsd) {
				next(err_xsd, null);
			} else {
				try {
					var xsdDoc = libxml.parseXml(res_xsd);
					loadMod.getManifestWithExt('xml', function (err_xml, res_xml) {
						if (err_xml) {
							next(err_xml, null);
						} else {
							try {
								var xmlDoc = libxml.parseXml(res_xml);
								xmlDoc.validate(xsdDoc);
								if (xmlDoc.validationErrors.length > 0) {
									return next(null, xmlDoc.validationErrors);
								}
								return next(null, "FermatManifest Cool");
							} catch (e) {
								return next(null, {
									"message": e.message,
									"location": e
								});
							}
						}
					});
				} catch (e) {
					return next(null, {
						"message": e.message,
						"location": e
					});
				}
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method addProc
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.addProc = function (req, next) {
	'use strict';
	try {
		procMod.insOrUpdProc(req.body.platfrm, req.body.name, req.body.desc, req.body.prev, req.body.next, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method getProc
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getProc = function (req, next) {
	'use strict';
	try {
		procMod.findProcById(req.params.proc_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method uptProc
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptProc = function (req, next) {
	'use strict';
	try {
		procMod.updateProcById(req.params.proc_id, req.body.platfrm, req.body.name, req.body.desc, req.body.prev, req.body.next, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method delProc
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.delProc = function (req, next) {
	'use strict';
	try {
		procMod.delProcById(req.params.proc_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method getComp
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getComp = function (req, next) {
	'use strict';
	try {
		compMod.findCompById(req.params.comp_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method uptComp
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptComp = function (req, next) {
	'use strict';
	try {
		compMod.updateCompById(req.params.comp_id, req.body.platfrm_id, req.body.suprlay_id, req.body.layer_id, req.body.name, req.body.type, req.body.description, req.body.difficulty, req.body.code_level, req.body.repo_dir, req.body.scrnshts, req.body.found, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method delComp
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.delComp = function (req, next) {
	'use strict';
	try {
		compMod.delCompById(req.params.comp_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method getLay
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getLay = function (req, next) {
	'use strict';
	try {
		layerMod.findLayerById(req.params.layer_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method uptLay
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptLay = function (req, next) {
	'use strict';
	try {
		layerMod.updateLayerById(req.params.layer_id, req.body.name, req.body.lang, req.body.suprlay, req.body.order, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method delLay
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.delLay = function (req, next) {
	'use strict';
	try {
		layerMod.delLayerById(req.params.layer_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method getSprlay
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getSprlay = function (req, next) {
	'use strict';
	try {
		suprlayMod.findSuprlayById(req.params.suprlay_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method uptSprlay
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptSprlay = function (req, next) {
	'use strict';
	try {
		suprlayMod.updateSuprlayById(req.params.suprlay_id, req.body.code, req.body.name, req.body.logo, req.body.deps, req.body.order, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method delSprlay
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.delSprlay = function (req, next) {
	'use strict';
	try {
		suprlayMod.delSuprlayById(req.params.suprlay_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method getPltf
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.getPltf = function (req, next) {
	'use strict';
	try {
		platfrmMod.findPlatfrmById(req.params.platfrm_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method listPlatforms
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.listPlatforms = function (req, next) {
	'use strict';
	try {
		platfrmMod.getPlatfrms(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method uptPltf
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptPltf = function (req, next) {
	'use strict';
	try {
		platfrmMod.updatePlatfrmById(req.params.platfrm_id, req.body.code, req.body.name, req.body.logo, req.body.deps, req.body.order, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method delPltf
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.delPltf = function (req, next) {
	'use strict';
	try {
		platfrmMod.delPlatfrmById(req.params.platfrm_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method listProcs
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.listProcs = function (req, next) {
	'use strict';
	try {
		procMod.getAllProces(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method addComp
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.addComp = function (req, next) {
	'use strict';
	try {
		compMod.insOrUpdComp(req.body.platfrm_id, req.body.suprlay_id, req.body.layer_id, req.body.name, req.body.type, req.body.description, req.body.difficulty, req.body.code_level, req.body.repo_dir, req.body.scrnshts, req.body.found, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				if (res.life_cycle.length === 0) {
					var loopInsertLifeCicles = function (i) {
						var name;
						switch (i) {
						case 0:
							name = "concept";
							break;
						case 1:
							name = "development";
							break;
						case 2:
							name = "qa";
							break;
						case 3:
							name = "production";
							break;
						default:
							next(null, res);
							break;
						}
						compMod.insOrUpdStatus(res._id, name, new Date(), new Date(), function (err_stat, res_stat) {
							if (err_stat) {
								next(err_stat, null);
							}
							res.life_cycle.push(res_stat._id);
							compMod.pushStatusToCompLifeCycleById(res._id, res_stat._id, function (err_push, res_push) {
								if (err_push) {
									next(err_push, null);
								}
								i = i + 1;
								loopInsertLifeCicles(i);
							});
						});
					};
					loopInsertLifeCicles(0);
				} else {
					next(null, res);
				}
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method listComps
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.listComps = function (req, next) {
	'use strict';
	try {
		compMod.getComps(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method addLayer
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.addLayer = function (req, next) {
	'use strict';
	try {
		layerMod.insOrUpdLayer(req.body.name, req.body.lang, req.body.suprlay, req.body.order, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method listLayers
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.listLayers = function (req, next) {
	'use strict';
	try {
		layerMod.getLayers(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method addSuprLay
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.addSuprLay = function (req, next) {
	'use strict';
	try {
		suprlayMod.insOrUpdSuprlay(req.body.code, req.body.name, req.body.logo, req.body.deps, req.body.order, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method listSuprLays
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.listSuprLays = function (req, next) {
	'use strict';
	try {
		suprlayMod.getSuprlays(function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method addPlatform
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.addPlatform = function (req, next) {
	'use strict';
	try {
		platfrmMod.insOrUpdPlatfrm(req.body.code, req.body.name, req.body.logo, req.body.deps, req.body.order, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * Add one or several life cicle to component
 * @method addLifeCiclesToComp
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptLifeCiclesToComp = function (req, next) {
	'use strict';
	try {
		compMod.uptLifeCiclesById(req.params.life_cicle_id, req.body.target, req.body.reached, function (err, res) {
			if (err) {
				next(err, null);
			}
			next(null, res);
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method addCompDev
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.addCompDev = function (req, next) {
	'use strict';
	try {
		compMod.insOrUpdCompDev(req.params.comp_id, req.body.dev_id, req.body.role, req.body.scope, req.body.percnt, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				compServ.pushDevToCompById(req.params.comp_id, res._id, function (err_push_dev, res_push_dev) {
					if (err_push_dev) {
						next(err_push_dev, null);
					} else {
						next(null, res);
					}
				});
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method uptCompDev
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptCompDev = function (req, next) {
	'use strict';
	try {
		compMod.updateCompDevById(req.params.comp_dev_id, req.params.comp_id, req.body.dev_id, req.body.role, req.body.scope, req.body.percnt, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method delCompDev
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.delCompDev = function (req, next) {
	'use strict';
	try {
		compMod.delCompDevById(req.params.comp_id, req.params.comp_dev_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method addStep
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.addStep = function (req, next) {
	'use strict';
	try {
		procMod.insertStep(req.params.proc_id, req.body.comp_id, req.body.type, req.body.title, req.body.desc, req.body.order, req.body.next, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method uptStep
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.uptStep = function (req, next) {
	'use strict';
	try {
		procMod.updateStepById(req.params.step_id, req.body.comp_id, req.body.type, req.body.title, req.body.desc, req.body.order, req.body.next, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * @method delStep
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.delStep = function (req, next) {
	'use strict';
	try {
		procMod.delStepById(req.params.step_id, function (err, res) {
			if (err) {
				next(err, null);
			} else {
				next(null, res);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
/**
 * [doLock description]
 *
 * @method doLock
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.doLock = function (req, next) {
	try {
		if (req.body.usr_id && //
			req.body.item_id && //
			req.body.item_type && //
			req.body.priority) {
			lockMod.insOrUpdLock(req.body.usr_id, // user that wants the lock
				req.body.item_id, // item to lock
				req.body.item_type, // type of item
				req.body.priority || 5, // lock priority
				function (err_lck, res_lck) {
					if (err_lck) {
						next(err_lck, null);
					} else {
						next(null, res_lck);
					}
				});
		}
	} catch (err) {
		next(err, null);
	}
};
/**
 * [doRelease description]
 *
 * @method doRelease
 *
 * @param  {[type]}   req  [description]
 * @param  {Function} next [description]
 *
 * @return {[type]}   [description]
 */
exports.doRelease = function (req, next) {
	try {
		if (req.body.usr_id && //
			req.body.item_id) {
			lockMod.delLock(req.body.usr_id, //
				req.body.item_id, //
				function (err_lck, res_lck) {
					if (err_lck) {
						next(err_lck, null);
					} else {
						next(null, res_lck);
					}
				});
		}
	} catch (err) {
		next(err, null);
	}
};