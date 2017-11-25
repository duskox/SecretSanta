var express = require('express');
var santaCtrl = require('./santaController');

var router = express.Router();

router.route('/').get(santaCtrl.postDefaultGETResponse);
router.route('/').post(santaCtrl.postDefaultPOSTResponse);

// router.route('/register').post(santaCtrl.addUser);
// router.route('/verify').post(santaCtrl.verifyToken);
router.route('/create').post(santaCtrl.createOrganisationAddUserToIt);
// router.route('/login').post(santaCtrl.loginUser);
router.route('/leave').post(santaCtrl.leaveOrganisation);




// router.route('/insertuser').post(santaCtrl.insertUser);

router.route('/join').post(santaCtrl.joinOrganisation);
router.route('/list').post(santaCtrl.listOfOrganisations);
router.route('/organisation').post();

// WORKING
router.route('/setuser').post(santaCtrl.setUser);



module.exports = router;
