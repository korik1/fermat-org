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
		if (req.params.layer_id) {
			req.body.item_id = req.params.layer_id;
			req.body.item_type = 'layer';
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
				winston.log('error', 'Error releasing layer lock', error);
			}
		});
	} catch (err) {
		winston.log('error', 'Error releasing layer lock', err);
	}
};
/**
 * using lock for layer routes
 */
//router.use(lock);
/**
 * @api {post} /v1/repo/usrs/:usr_id/layers add layer
 * @apiVersion 0.0.1
 * @apiName AddLayer
<<<<<<< HEAD
 * @apiParam {String} name    	Layer name.
 * @apiParam {String} lang    	{java, javascript, c++, c#, etc}.
 * @apiParam {String} suprlay	superlayer code (optional).
=======
 * @apiParam {String} name    Layer name.
 * @apiParam {String} lang   Programming language.
 * @apiParam {String} suprlay    Supraly name.
>>>>>>> 0a761e81343359954052a5a6ce99531e1628d12d
 * @apiParam {Number} order Indicates the position where the layer this with respect to other.
 * @apiGroup Repo-Layer
 * @apiDescription Add a layer to the architecture of fermat.
 */
router.post('/', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.body.name) || //
			!security.isValidData(req.body.lang) || //
			!security.isValidData(req.body.order)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.addLayer(req, function (error, result) {
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
 * @api {get} /v1/repo/usrs/:usr_id/layers get list layers
 * @apiVersion 0.0.1
 * @apiName ListLayers
 * @apiGroup Repo-Layer
 * @apiDescription get a list of layer to the architecture of fermat.
 */
router.get('/', function (req, res, next) {
	'use strict';
	try {
		repMod.listLayers(req, function (error, result) {
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
 * @api {get} /v1/repo/usrs/:usr_id/layers/:layer_id get layer
 * @apiVersion 0.0.1
 * @apiName GetLay
 * @apiGroup Repo-Layer
 * @apiParam {ObjectId} layer_id Unique identifier of the layer.
 * @apiDescription Get a layer to the architecture of fermat.
 */
router.get('/:layer_id', function (req, res, next) {
	'use strict';
	try {
		lock(req, function (err_lck, res_lck) {
			if (err_lck) {
				res.status(423).send(err_lck);
			} else {
				repMod.getLay(req, function (error, result) {
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
						release(req);
					}
				});
			}
		});
	} catch (err) {
		next(err);
	}
});
/**
 * @api {put} /v1/repo/usrs/:usr_id/layers/:layer_id update layer
 * @apiVersion 0.0.1
 * @apiName UptLay
 * @apiGroup Repo-Layer
 * @apiParam {ObjectId} layer_id Represents the identifier of the layer
 * @apiParam {String} name    Layer name.
<<<<<<< HEAD
 * @apiParam {String} lang    xxxxx.
 * @apiParam {String} suprlay    xxxxx.
=======
 * @apiParam {String} lang   Programming language.
 * @apiParam {String} suprlay    Supraly name.
>>>>>>> 0a761e81343359954052a5a6ce99531e1628d12d
 * @apiParam {Number} order Indicates the position where the layer this with respect to other.
 * @apiDescription Update layer to the architecture of fermat.
 */
router.put('/:layer_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.layer_id) || //
			!security.ifExistIsValidData(req.body.name) || //
			!security.ifExistIsValidData(req.body.lang) ||
			!security.ifExistIsValidData(req.body.order)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.uptLay(req, function (error, result) {
				if (error) {
					res.status(200).send(error);
				} else {
					res.status(200).send(result);
				}
				release(req);
			});
		}
	} catch (err) {
		next(err);
	}
});

/**
 * @api {delete} /v1/repo/usrs/:usr_id/layers/:layer_id delete layer
 * @apiVersion 0.0.1
 * @apiName DelLay
 * @apiGroup Repo-Layer
 * @apiParam {ObjectId} layer_id Represents the identifier of the layer
 * @apiDescription Delete layer to the architecture of fermat.
 */
router.delete('/:layer_id', function (req, res, next) {
	'use strict';
	try {
		if (!security.isValidData(req.params.layer_id)) {
			res.status(412).send({
				"message": "missing or invalid data"
			});
		} else {
			repMod.delLay(req, function (error, result) {
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
// layer router export
module.exports = router;
