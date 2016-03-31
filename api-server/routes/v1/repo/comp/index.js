var winston = require('winston');
var express = require('express');
var router = express.Router();
var repMod = require('../../../../modules/repository');
var security = require('../../../../lib/utils/security');
/**
 * [description]
 *
 * @method
 *
 * @param  {[type]} req   [description]
 * @param  {[type]} res   [description]
 * @param  {[type]} next  [description]
 *
 * @return {[type]} [description]
 */
var lock = function (req, next) {
	console.log('doing lock...');
	try {
		console.dir(req.params);
		console.dir(req.body);
		if (req.params.comp_id) {
			req.body.item_id = req.params.comp_id;
			req.body.item_type = 'comp';
			req.body.priority = 5;
			console.dir(req.body);
			repMod.doLock(req, function (error, result) {
				if (error) {
					next(error, null);
				} else {
					next(null, result);
				}
			});
		} else {
			next(null, null);
		}
	} catch (err) {
		next(err, null);
	}
};
/**
 * [release description]
 *
 * @method release
 *
 * @param  {[type]} req [description]
 *
 * @return {[type]} [description]
 */
var release = function (req) {
	try {
		repMod.doRelease(req, function (error, result) {
			if (error) {
				winston.log('error', 'Error releasing comp lock', error);
			}
		});
	} catch (err) {
		winston.log('error', 'Error releasing comp lock', err);
	}
};
/**
 * using lock for comp routes
 */
//router.use(lock);
/**
 * @api {post} /v1/repo/usrs/:usr_id/comps add components
 * @apiVersion 0.0.1
 * @apiName AddComp
 * @apiGroup Repo-Comp
 * @apiParam {type} layer_id   Unique identifier of the layer.
 * @apiParam {String} name    Component name.
 * @apiParam {String} type    Component type.
 * @apiParam {Number} difficulty Component complexity developed  rank (0- 10).
 * @apiParam {String} code_level   Developing state api.
 * @apiParam {ObjectId} platfrm_id   Unique identifier of the  platfrtm.
 * @apiParam {ObjectId} suprlay_id    Unique identifier of the  suprlay.
 * @apiParam {String} description  Description of  components.
 * @apiParam {String} repo_dir Directory of repo.
 * @apiDescription Add a component to the architecture fermat.
 */
router.post('/', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.body.layer_id) || // required
			!security.isValidData(req.body.name) || // required
			!security.isValidTypeComp(req.body.type) || // required
			!security.isValidDifficulty(req.body.difficulty) || // required
			!security.isValidLifeCicle(req.body.code_level) || // required
			(!(typeof req.body.platfrm_id != "undefined" && security.isValidData(req.body.platfrm_id)) && !(typeof req.body.suprlay_id != "undefined" && security.isValidData(req.body.suprlay_id))) || !security.ifExistIsValidData(req.body.description) || !security.ifExistIsValidData(req.body.repo_dir)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.addComp(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					res.status(201).send(result);
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/usrs/:usr_id/comps list comps
 * @apiVersion 0.0.1
 * @apiName ListComps
 * @apiGroup Repo-Comp

 * @apiDescription Get a list of components of the architecture fermat.
 */
router.get('/', function (req, res, next) {
	'use strict';
	try {
		repMod.listComps(req, function (error, result) {
			if (error) {
				res.status(200).send(error);
			} else {
				res.status(200).send(result);
			}
		});
	} catch (err) {
		next(err);
	}
});
/**
 * @api {put} /v1/repo/usrs/:usr_id/comps/:comp_id/life-cicles/:life_cicle_id update lifecicles to component
 * @apiVersion 0.0.1
 * @apiName UptLifeCiclesToComp
 * @apiParam {ObjectId} comp_id  Unique identifier of the component.
 * @apiParam {ObjectId} life_cicle_id  Unique identifier of the  life cicle.
 * @apiParam {Date} target    Estimated completion date.
 * @apiParam {Date} reached    True date of completion.
 * @apiGroup Repo-Comp
 * @apiDescription updates the lifecycle of a component of the architecture fermat.
<<<<<<< HEAD
=======

>>>>>>> upstream/master
 */
router.put('/:comp_id/life-cicles/:life_cicle_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.comp_id) || // required
			!security.isValidData(req.params.life_cicle_id) || // required
			!security.ifExistIsValidData(req.body.target) ||
			!security.ifExistIsValidData(req.body.reached)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.uptLifeCiclesToComp(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					if (result) {
						res.status(200).send(result);
					} else {
						res.status(404).send({
							message: "NOT FOUND"
						});
					}
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {post} /v1/repo/usrs/:usr_id/comps/:comp_id/comp-devs add component developer
 * @apiVersion 0.0.1
 * @apiName AddCompDev
 * @apiParam {ObjectId} comp_id    Unique identifier of the component.
 * @apiParam {ObjectId} dev_id    Unique identifier of the developer.
 * @apiParam {String} role    Developer role.
 * @apiParam {String} scope    Range in plugin.
 * @apiParam {Number} percnt    Percentage that has developed.
.
 * @apiGroup Repo-Comp
 * @apiDescription Add component to developer.
 */
router.post('/:comp_id/comp-devs', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.comp_id) || //
			!security.isValidData(req.body.dev_id) || //
			!security.isValidData(req.body.role) || //
			!security.isValidData(req.body.scope) || //
			!security.isValidData(req.body.percnt)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.addCompDev(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					if (result) {
						res.status(201).send(result);
					} else {
						res.status(404).send({
							message: "NOT FOUND"
						});
					}
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {put} /v1/repo/usrs/:usr_id/comps/:comp_id/comp-devs/:comp_dev_id update component developer
 * @apiVersion 0.0.1
 * @apiName UptCompDev
 * @apiParam {ObjectId} comp_id    Unique identifier of the component.
 * @apiParam {ObjectId} dev_id    Unique identifier of the developer.
 * @apiParam {String} role    Developer role.
 * @apiParam {String} scope   Range in plugin.
 * @apiParam {Number} percnt    Percentage that has developed.
 * @apiGroup Repo-Comp
 * @apiDescription Update component to developer.
 */
router.put('/:comp_id/comp-devs/:comp_dev_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.comp_id) || // required
			!security.isValidData(req.params.comp_dev_id) || // required
			!security.ifExistIsValidData(req.body.dev_id) ||
			!security.ifExistIsValidData(req.body.role) ||
			!security.ifExistIsValidData(req.body.scope) ||
			!security.ifExistIsValidData(req.body.percnt)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.uptCompDev(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					if (result) {
						res.status(200).send(result);
					} else {
						res.status(404).send({
							message: "NOT FOUND"
						});
					}
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {delete} /v1/repo/usrs/:usr_id/comps/:comp_id/comp-devs/:comp_dev_id delete component developer
 * @apiVersion 0.0.1
 * @apiName DelCompDev
 * @apiParam {ObjectId} comp_id    Unique identifier of the component.
 * @apiParam {ObjectId} dev_id    Unique identifier of the developer.
 * @apiGroup Repo-Comp
 * @apiDescription Delete component to developer.
 */
router.delete('/:comp_id/comp-devs/:comp_dev_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.comp_id) || //
			!security.isValidData(req.params.comp_dev_id) //
		) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.delCompDev(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					if (result) {
						res.status(204).send();
					} else {
						res.status(404).send({
							message: "NOT FOUND"
						});
					}
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {get} /v1/repo/usrs/:usr_id/comps/:comp_id get component
 * @apiVersion 0.0.1
 * @apiName GetComp
 * @apiParam {ObjectId} comp_id    Unique identifier of the component.
 * @apiGroup Repo-Comp
 * @apiParam {ObjectId} comp_id Represents the component identifier.
 */
router.get('/:comp_id', function (req, res, next) {
	'use strict';
	try {
		lock(req, function (err_lck, res_lck) {
			if (err_lck) {
				res.status(423).send(err_lck);
			} else {
				repMod.getComp(req, function (error, result) {
					if (error) {
						res.status(200).send(error);
					} else {
						if (result) {
							res.status(200).send(result);
						} else {
							res.status(404).send({
								message: "NOT FOUND"
							});
						}
					}
				});
			}
		});
	} catch (err) {
		next(err);
	}
});
/**
 * @api {put} /v1/repo/usrs/:usr_id/comps/:comp_id update component
 * @apiVersion 0.0.1
 * @apiName UptComp
 * @apiParam {ObjectId} comp_id    Unique identifier of the component.
 * @apiParam {ObjectId} layer_id   Unique identifier of the layer.
 * @apiParam {String} name    Component name.
 * @apiParam {String} type    Component type.
 * @apiParam {Number} difficulty Component complexity developed  rank (0- 10).
 * @apiParam {String} code_level   Developing state api.
 * @apiParam {String} description  Description of  components.
 * @apiParam {String} repo_dir      Directory of repo.
 * @apiGroup Repo-Comp
 * @apiParam {ObjectId} comp_id Represents the component identifier.
 */
router.put('/:comp_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.comp_id) ||
			!security.ifExistIsValidData(req.body.layer_id) ||
			!security.ifExistIsValidData(req.body.name) ||
			!security.ifExistIsValidData(req.body.type) ||
			!security.ifExistIsValidDifficulty(req.body.difficulty) ||
			!security.ifExistIsValidLifeCicle(req.body.code_level) ||
			!security.ifExistIsValidData(req.body.description) ||
			!security.ifExistIsValidData(req.body.repo_dir)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.uptComp(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					if (result) {
						res.status(200).send(result);
					} else {
						res.status(404).send({
							message: "NOT FOUND"
						});
					}
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});
/**
 * @api {delete} /v1/repo/usrs/:usr_id/comps/:comp_id delete component
 * @apiVersion 0.0.1
 * @apiName DelComp
 * @apiParam {ObjectId} comp_id    Unique identifier of the component.
 * @apiGroup Repo-Comp
 * @apiParam {ObjectId} comp_id Represents the component identifier.
 */
router.delete('/:comp_id', function (req, res, next) {
	'use strict';
	try {
		repMod.delComp(req, function (error, result) {
			if (error) {
				res.status(200).send(error);
			} else {
				if (result) {
					res.status(204).send();
				} else {
					res.status(404).send({
						message: "NOT FOUND"
					});
				}
			}
			release(req);
		});
	} catch (err) {
		next(err);
	}
});
// comp router export
module.exports = router;
