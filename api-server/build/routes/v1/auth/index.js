var express = require('express');
var router = express.Router();
var authMod = require('../../../modules/auth');
var config = require('../../../config.js');
/**
 * @api {get} /v1/auth/login sign in and/or log in
 * @apiName Login
 * @apiVersion 0.0.1
 * @apiGroup Auth
 * @apiParam {ObjectId} code Represents the authorization code to access the registered application on github.
 * @apiParam {ObjectId} api_key Represents the key to the application registered on the server.
 * @apiDescription Register the user and returns the authorization to use the api.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "56b8c4c4288ff76e0f8225d3",
 *       "_usr_id": "object usr",
 *       "_app_id": "object app",
 *       "axs_key": "56b8c4c4288ff76e0f8225d1"
 *     }
 */
router.get('/login', function (req, resp, next) {
    'use strict';
    try {
        console.log("Login...");
        var code = req.query.code;
        var api_key = req.query.api_key;
        var url = "https://github.com/login/oauth/access_token?client_id="+config.client_id+"&client_secret="+config.client_secret+"&" + "code=" + code;
        authMod.login(url, api_key, function (err_auth, res_auth) {
            if (err_auth) {
                console.log("Error", err_auth);
                resp.status(200).send(err_auth);
            } else {
                console.log("Info", "Authorization granted");
                resp.status(200).send(res_auth);
            }
        });
    } catch (err) {
        console.error("Error", err);
        next(err);
    }
});
/**
 * @api {get} /v1/auth/logout logout
 * @apiName Logout
 * @apiVersion 0.0.1
 * @apiGroup Auth
 * @apiParam {ObjectId} api_key Represents the key to the application registered on the server.
 * @apiParam {ObjectId} axs_key Represents the access key to use the api.
 * @apiDescription Removes the token.
 * @apiSuccess {Boolean} isLogout It indicates that the token has been removed.
 */
router.get('/logout', function (req, resp, next) {
    'use strict';
    try {
        console.log("Logout...");
        var axs_key = req.query.axs_key;
        var api_key = req.query.api_key;
        authMod.logout(api_key, axs_key, function (err_logout, res_logout) {
            if (err_logout) {
                console.log("Error", err_logout);
                resp.status(200).send(err_logout);
            } else {
                console.log("Info", "Authorization granted");
                resp.status(200).send(res_logout);
            }
        });
    } catch (err) {
        console.error("Error", err);
        next(err);
    }
});
// router export
module.exports = router;