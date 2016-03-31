/*global require*/
var express = require('express');
var router = express.Router();
// split up route handling
var repo = require('./repo');
var net = require('./net');
var auth = require('./auth');
// list route namespaces
router.use('/repo', repo);
router.use('/net', net);
router.use('/auth', auth);
// etc.
module.exports = router;