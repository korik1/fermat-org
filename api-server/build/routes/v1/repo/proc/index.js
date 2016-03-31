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
		if (req.params.proc_id) {
			req.body.item_id = req.params.proc_id;
			req.body.item_type = 'proc';
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
				winston.log('error', 'Error releasing proc lock', error);
			}
		});
	} catch (err) {
		winston.log('error', 'Error releasing proc lock', err);
	}
};
/**
 * using lock for proc routes
 */
//router.use(lock);
/**
 * @api {post} /v1/repo/usrs/:usr_id/procs add process
 * @apiVersion 0.0.1
 * @apiName AddProc
 * @apiGroup Repo-Proc
 * @apiParam {Object} platfrm Platform data.
 * @apiParam {String} name Process name.
 * @apiParam {String} desc Process description
 * @apiParam {String} prev Id of the previous process.
 * @apiParam {String} next Id the next process.
 * @apiDescription Add a process to the architecture of fermat.
 */
router.post('/', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.body.platfrm) || //
			!security.isValidData(req.body.name) || //
			!security.isValidData(req.body.desc) || //
			!security.ifExistIsValidData(req.body.prev) || //
			!security.ifExistIsValidData(req.body.next)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.addProc(req, function (error, result) {
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
 * @api {get} /v1/repo/usrs/:usr_id/procs lists process
 * @apiVersion 0.0.1
 * @apiName ListProcs
 * @apiGroup Repo-Proc
 * @apiDescription Get lists of process to the architecture of fermat.
 */
router.get('/', function (req, res, next) {
	'use strict';
	try {
		repMod.listProcs(req, function (error, result) {
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
 * @api {post} /v1/repo/usrs/:usr_id/procs/:proc_id/steps add step
 * @apiVersion 0.0.1
 * @apiName AddStep
 * @apiGroup Repo-Proc
 * @apiParam {ObjectId} proc_id Unique identifier of the process.
 * @apiParam {ObjectId} comp_id Unique identifier of the component.
 * @apiParam {String} type Step type.
 * @apiParam {String} title Step title.
 * @apiParam {String} desc Step description.
 * @apiParam {Number} order Indicates the position where the step this with respect to other.
 * @apiDescription Adds a step to the process.
 */
router.post('/:proc_id/steps', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.proc_id) || //
			!security.isValidData(req.body.comp_id) ||
			!security.isValidData(req.body.type) || //
			!security.isValidData(req.body.title) || //
			!security.isValidData(req.body.desc) || //
			!security.isValidData(req.body.order) ||
			!security.ifExistIsValidData(req.body.next)) {
			res.status(412).send({
				message: 'missing or invalid data'
			});
		} else {
			repMod.addStep(req, function (error, result) {
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
 * @api {put} /v1/repo/usrs/:usr_id/procs/:proc_id/steps/:step_id update step
 * @apiVersion 0.0.1
 * @apiName UptStep
 * @apiGroup Repo-Proc
 * @apiParam {ObjectId} proc_id Unique identifier of the process.
 * @apiParam {ObjectId} step_id Unique identifier of the step.
 * @apiParam {ObjectId} comp_id Unique identifier of the component.
 * @apiParam {String} type Step type.
 * @apiParam {String} title Step title.
 * @apiParam {String} desc Step description.
 * @apiParam {String} order Indicates the position where the step this with respect to other.
 * @apiDescription Updates a step of a process.
 */
router.put('/:proc_id/steps/:step_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.proc_id) || //
			!security.isValidData(req.params.step_id) || //
			!security.ifExistIsValidData(req.body.comp_id) ||
			!security.ifExistIsValidData(req.body.type) || //
			!security.ifExistIsValidData(req.body.title) || //
			!security.ifExistIsValidData(req.body.desc) || //
			!security.ifExistIsValidData(req.body.order)) {
			res.status(412).send({
				message: 'missing or invalid data'
			});
		} else {
			repMod.uptStep(req, function (error, result) {
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
 * @api {delete} /v1/repo/usrs/:usr_id/procs/:proc_id/steps/:step_id delete step
 * @apiVersion 0.0.1
 * @apiName DelStep
 * @apiGroup Repo-Proc
 * @apiParam {ObjectId} proc_id Unique identifier of the process.
 * @apiParam {ObjectId} step_id Unique identifier of the step.
 * @apiDescription Delete a step of a process.
 */
router.delete('/:proc_id/steps/:step_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.proc_id) || //
			!security.isValidData(req.params.step_id)) {
			res.status(412).send({
				message: 'missing or invalid data'
			});
		} else {
			repMod.delStep(req, function (error, result) {
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
 * @api {delete} /v1/repo/usrs/:usr_id/procs/:proc_id get process
 * @apiVersion 0.0.1
 * @apiName GetProc
 * @apiGroup Repo-Proc
 * @apiParam {ObjectId} proc_id Unique identifier of the process.
 * @apiDescription Get process architecture fermat.
 */
router.get('/:proc_id', function (req, res, next) {
	'use strict';
	try {
		lock(req, function (err_lck, res_lck) {
			if (err_lck) {
				res.status(423).send(err_lck);
			} else {
				repMod.getProc(req, function (error, result) {
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
 * @api {put} /v1/repo/usrs/:usr_id/procs/:proc_id update process
 * @apiVersion 0.0.1
 * @apiName UptProc
 * @apiGroup Repo-Proc
 * @apiParam {ObjectId} proc_id Unique identifier of the process.
 * @apiParam {Object} platfrm Platform data.
 * @apiParam {String} name Process name.
 * @apiParam {String} desc Process description.
 * @apiParam {String} prev Id of the previous process.
 * @apiParam {String} next Id the next process.
 * @apiDescription Update process architecture fermat.
 */
router.put('/:proc_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.proc_id) || //
			!security.ifExistIsValidData(req.body.platfrm) || //
			!security.ifExistIsValidData(req.body.name) ||
			!security.ifExistIsValidData(req.body.desc) || //
			!security.ifExistIsValidData(req.body.prev) || //
			!security.ifExistIsValidData(req.body.next)) {
			res.status(412).send({
				message: 'missing or invalid data'
			});
		} else {
			repMod.uptProc(req, function (error, result) {
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
 * @api {put} /v1/repo/usrs/:usr_id/procs/:proc_id delete process
 * @apiVersion 0.0.1
 * @apiName DelProc
 * @apiGroup Repo-Proc
 * @apiParam {ObjectId} proc_id Unique identifier of the process.
 * @apiDescription Update process architecture fermat.
 */
router.delete('/:proc_id', function (req, res, next) {
	'use strict';
	try {
		repMod.delProc(req, function (error, result) {
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
// proc router export
module.exports = router;