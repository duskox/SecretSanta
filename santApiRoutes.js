var express = require('express');
var santaCtrl = require('./santaController');

var router = express.Router();

router.route('/').get(santaCtrl.postDefaultGETResponse);
router.route('/').post(santaCtrl.postDefaultPOSTResponse);

module.exports = router;
