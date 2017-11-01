var express = require('express');
var santaCtrl = require('./santaController');

var router = express.Router();

router.route('/').get(santaCtrl.postDefaultGETResponse);
router.route('/').post(santaCtrl.postDefaultPOSTResponse);

router.route('/register').post(santaCtrl.addUser);
router.route('/verify').post(santaCtrl.verifyToken);
router.route('/create').post(santaCtrl.createOrganisationAddUserToIt);
router.route('/login').post(santaCtrl.loginUser);
router.route('/leave').post(santaCtrl.leaveOrganisation);
router.route('/setuser').post(santaCtrl.setUser);

router.route('/insertuser').post(santaCtrl.insertUser);

router.route('/join').post();
router.route('/list').post();
router.route('/organisation').post();

module.exports = router;
