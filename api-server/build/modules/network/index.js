var linkMod = require('./link');
var nodeMod = require('./node');
var waveMod = require('./wave');
var loadNet = require('./lib/loader');
exports.getServerNetwork = function (req, next) {
	'use strict';
	try {
		waveMod.findLastWave(function (err_wav, res_wav) {
			if (err_wav) {
				next(err_wav, null);
			} else if (res_wav) {
				//TODO: get hashes
				nodeMod.findNodsByWaveIdAndType(res_wav._id, 'server', function (err_nods, res_nods) {
					if (err_nods) {
						next(err_nods, null);
					} else {
						var res_obj = [];
						var loopNods = function (i) {
							if (i < res_nods.length) {
								//TODO: search links
								var parent = res_nods[i];
								linkMod.findChildren(res_wav._id, parent._id, function (err_chldrn, res_chldrn) {
									if (err_chldrn) {
										res_obj.push(parent);
										loopNods(++i);
									} else {
										console.log("en res_chldrn");
										console.log(res_chldrn);
										var children = [];
										var loopChldrn = function (j) {
											var link = res_chldrn[j];
											if (j < res_chldrn.length) {
												//TODO: finde node
												nodeMod.findNodById(link._chld_nod_id, function (err_chld, res_chld) {
													if (err_chld) {
														loopChldrn(++j);
													} else {
														children.push(res_chld);
														loopChldrn(++j);
													}
												});
											} else {
												parent.children = children;
												res_obj.push(parent);
												loopNods(++i);
											}
										};
										if (res_chldrn && Array.isArray(res_chldrn) && res_chldrn.length > 0) {
											loopChldrn(0);
										} else {
											parent.children = children;
											res_obj.push(parent);
											loopNods(++i);
										}
									}
								});
							} else {
								next(null, res_obj);
							}
						};
						if (res_nods && Array.isArray(res_nods)) {
							loopNods(0);
						} else {
							next(null, res_obj);
						}
					}
				});
			} else {
				next(null, null);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
exports.getChildren = function (req, next) {
	'use strict';
	try {
		waveMod.findLastWave(function (err_wav, res_wav) {
			console.log(res_wav);
			if (err_wav) {
				next(err_wav, null);
			} else if (res_wav) {
				nodeMod.findNodsByWaveIdAndHash(res_wav._id, req.params.hash, function (err_nods, res_nods) {
					console.log("en findDNOs");
					console.log(res_nods);
					if (err_nods) {
						next(err_nods, null);
					} else {
						if (res_nods && Array.isArray(res_nods) && res_nods.length > 0) {
							var parent = res_nods[0];
							linkMod.findChildren(res_wav._id, parent._id, function (err_chldrn, res_chldrn) {
								console.log(err_chldrn);
								console.log(res_chldrn);
								if (err_chldrn) {
									parent.children = [];
									next(null, parent);
								} else {
									var children = [];
									var loopChldrn = function (j) {
										var link = res_chldrn[j];
										if (j < res_chldrn.length) {
											nodeMod.findNodById(link._chld_nod_id, function (err_chld, res_chld) {
												if (err_chld) {
													loopChldrn(++j);
												} else {
													children.push(res_chld);
													loopChldrn(++j);
												}
											});
										} else {
											parent.children = children;
											next(null, parent);
										}
									};
									if (res_chldrn && Array.isArray(res_chldrn) && res_chldrn.length > 0) {
										loopChldrn(0);
									} else {
										parent.children = children;
										next(null, parent);
									}
								}
							});
						} else {
							next(null, {});
						}
					}
				});
			} else {
				next(null, null);
			}
		});
	} catch (err) {
		next(err, null);
	}
};
exports.addWave = function (req, next) {
	'use strict';
	try {
		loadNet.createWave(function (err_wave, res_wave) {
			if (err_wave) {
				return next(err_wave, null);
			}
			loadNet.createNodes(res_wave, req.body.wave, function (err_nod, res_nod) {
				if (err_nod) {
					return next(err_nod, null);
				}
				return next(null, res_nod);
			});
		});
	} catch (err) {
		next(err, null);
	}
};
/*jshint +W069 */