var express = require('express');
var santaCtrl = require('./santaController');

var router = express.Router();

router.route('/').get(santaCtrl.postDefaultGETResponse);
router.route('/').post(santaCtrl.postDefaultPOSTResponse);

router.route('/register').post();
router.route('/login').post();
router.route('/create').post();
router.route('/join').post();
router.route('/list').post();
router.route('/organisation').post();

module.exports = router;
