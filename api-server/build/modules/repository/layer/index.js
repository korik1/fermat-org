var layerSrv = require('./services/layer');
var compMod = require('../component');
var LayerMdl = require('./models/layer');
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
var swapOrder = function (action, oldSpot, newSpot, callback) {
	orderLib.swapOrder(action, oldSpot, newSpot, function (err, query, set) {
		if (err) {
			return callback(err, null);
		} else {
			layerSrv.updateLayers(query, set, function (err_srt, res_srt) {
				if (err_srt) {
					return callback(err_srt, null);
				} else {
					return callback(null, res_srt);
				}
			});
		}
	});
};
/**
 * [insOrUpdLayer description]
 *
 * @method insOrUpdLayer
 *
 * @param  {[type]}      name          [description]
 * @param  {[type]}      lang          [description]
 * @param  {[type]}      platfrm_index [description]
 * @param  {[type]}      layer_index   [description]
 * @param  {Function}    callback      [description]
 *
 * @return {[type]}      [description]
 */
exports.insOrUpdLayer = function (name, lang, suprlay, order, callback) {
	'use strict';
	try {
		layerSrv.findLayerByName(name, function (err_lay, res_lay) {
			if (err_lay) {
				return callback(err_lay, null);
			}
			if (res_lay) {
				var set_obj = {};
				if (name && name !== res_lay.name) {
					set_obj.name = name;
					res_lay.name = name;
				}
				if (lang && lang !== res_lay.lang) {
					set_obj.lang = lang;
					res_lay.lang = lang;
				}
				if (suprlay && suprlay !== res_lay.suprlay) {
					set_obj.suprlay = suprlay;
					res_lay.suprlay = suprlay;
					if (suprlay.toLowerCase() == 'false' || suprlay.toLowerCase() == 'null' || suprlay.length > 3) {
						set_obj.suprlay = null;
						res_lay.suprlay = null;
					}
				}
				if (order !== -1 && order !== res_lay.order) {
					set_obj.order = order;
					res_lay.order = order;
				}
				if (Object.keys(set_obj).length > 0) {
					if (typeof set_obj.order != 'undefined' && set_obj.order > -1) {
						swapOrder('update', res_lay.order, set_obj.order, function (err_sld, res_sld) {
							if (err_sld) {
								return callback(err_sld, null);
							} else {
								layerSrv.updateLayerById(res_lay._id, set_obj, function (err_upd, res_upd) {
									if (err_upd) {
										return callback(err_upd, null);
									}
									return callback(null, set_obj);
								});
							}
						});
					} else {
						layerSrv.updateLayerById(res_lay._id, set_obj, function (err_upd, res_upd) {
							if (err_upd) {
								return callback(err_upd, null);
							}
							return callback(null, set_obj);
						});
					}
				} else {
					return callback(null, res_lay);
				}
			} else {
				if (suprlay && (suprlay.toLowerCase() == 'false' || suprlay.toLowerCase() == 'null' || suprlay.length > 3)) {
					suprlay = null;
				}
				if (name && lang) {
					var layer = new LayerMdl(name, lang, suprlay || null, order);
					swapOrder('insert', null, layer.order, function (err_sld, res_sld) {
						if (err_sld) {
							return callback(err_sld, null);
						} else {
							layerSrv.insertLayer(layer, function (err_ins, res_ins) {
								if (err_ins) {
									return callback(err_ins, null);
								}
								return callback(null, res_ins);
							});
						}
					});
				} else {
					return callback(null, null);
				}
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [getLayers description]
 *
 * @method getLayers
 *
 * @param  {Function} callback [description]
 *
 * @return {[type]}   [description]
 */
exports.getLayers = function (callback) {
	'use strict';
	try {
		layerSrv.findAllLayers({}, {
			order: 1
		}, function (err, layers) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, layers);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delAllLayers description]
 *
 * @method delAllLayers
 *
 * @param  {Function}   callback [description]
 *
 * @return {[type]}     [description]
 */
exports.delAllLayers = function (callback) {
	'use strict';
	try {
		layerSrv.delAllLayers(function (err, layers) {
			if (err) {
				return callback(err, null);
			}
			return callback(null, true);
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [findLayerById description]
 *
 * @method findLayerById
 *
 * @param  {[type]}     _id       [description]
 * @param  {[type]}     callback  [description]
 *
 * @return {[type]}     [description]
 */
exports.findLayerById = function (_id, callback) {
	'use strict';
	try {
		layerSrv.findLayerById(_id, function (err_lay, res_lay) {
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
 * [updateLayerById description]
 *
 * @method updateLayerById
 *
 *
 * @param  {[type]}     _lay_id         [description]
 * @param  {[type]}     name            [description]
 * @param  {[type]}     lang            [description]
 * @param  {[type]}     suprlay         [description]
 * @param  {[type]}     order           [description]
 * @param  {Function}   callback        [description]
 *
 * @return {[type]}    [description]
 */
exports.updateLayerById = function (_lay_id, name, lang, suprlay, order, callback) {
	'use strict';
	try {
		var set_obj = {};
		if (name) {
			set_obj.name = name;
		}
		if (lang) {
			set_obj.lang = lang;
		}
		if (suprlay) {
			set_obj.suprlay = suprlay;
		}
		if (typeof order != "undefined") {
			set_obj.order = order;
		}
		layerSrv.findLayerById(_lay_id, function (err_lay, res_lay) {
			if (err_lay) {
				return callback(err_lay, null);
			}
			if (typeof set_obj.order != 'undefined' && set_obj.order > -1) {
				swapOrder('update', res_lay.order, set_obj.order, function (err_sld, res_sld) {
					if (err_sld) {
						return callback(err_sld, null);
					} else {
						layerSrv.updateLayerById(res_lay._id, set_obj, function (err_upd, res_upd) {
							if (err_upd) {
								return callback(err_upd, null);
							}
							return callback(null, set_obj);
						});
					}
				});
			} else {
				layerSrv.updateLayerById(res_lay._id, set_obj, function (err_upd, res_upd) {
					if (err_upd) {
						return callback(err_upd, null);
					}
					return callback(null, set_obj);
				});
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};
/**
 * [delLayerById description]
 *
 * @method delLayerById
 *
 * @param  {[type]}        _id      [description]
 * @param  {Function}      callback [description]
 *
 * @return {[type]}        [description]
 */
exports.delLayerById = function (_id, callback) {
	'use strict';
	try {
		var delLayer = function () {
			layerSrv.findLayerById(_id, function (err_lay, res_lay) {
				if (err_lay) {
					return callback(err_lay, null);
				} else if (res_lay) {
					// ordering function
					swapOrder('delete', res_lay.order, null, function (err_sld, res_sld) {
						if (err_sld) {
							return callback(err_sld, null);
						} else {
							layerSrv.delLayerById(res_lay._id, function (err_del, res_del) {
								if (err_del) {
									return callback(err_del, null);
								}
								return callback(null, res_lay);
							});
						}
					});
				} else {
					return callback(null, null);
				}
			});
		};
		compMod.findCompsByLayerId(_id, function (err_comp, res_comps) {
			if (err_comp) {
				return callback(err_comp, null);
			}
			if (res_comps.length > 0) {
				var _comps = res_comps;
				var loopDelComps = function () {
					if (_comps.length <= 0) {
						delLayer();
					} else {
						var comp = _comps.pop();
						compMod.delCompById(comp._id, function (err_del_comp, res_del_comp) {
							if (err_del_comp) {
								return callback(err_del_comp, null);
							} else {
								loopDelComps();
							}
						});
					}
				};
				loopDelComps();
			} else {
				delLayer();
			}
		});
	} catch (err) {
		return callback(err, null);
	}
};