var postgresDB = require('pg');
var reqUtil = require('./utils/requestUtils');
var hashTool = require('./utils/hashTool');
var tokenTool = require('./utils/tokenTool');
var dbHelper = require('./dbHelper');

function addUser(req,res) {
  const payload = req.body;
    if (!payload.email || !payload.password) {
      const errorMessage = { message: "Register call with invalid parameters" };
      res.status(400).send(JSON.stringify(errorMessage));
      return;
    }

    var passHash = hashTool.getHashForString(payload.password);
    var userToken = tokenTool.getTokenForUserEmail(payload.email);

    var userId = dbHelper.insertUser(payload.name, payload.email, passHash);
    dbHelper.insertUserToken(userId, userToken);

    var result_body = { token: userToken };

    res.status(200).send(JSON.stringify(result_body));
}

function getOrganisationInfo(req, res) {

}

function returnListOfOrganisations(req, res) {

}

function registerNewUser(req, res) {

}

function assignUserToOrganisation(req, res) {

}
function createNewOrganisation(req, res) {

}
function loginUser(req, res) {

}

module.exports = {addUser, getOrganisationInfo, returnListOfOrganisations, registerNewUser, assignUserToOrganisation, createNewOrganisation, loginUser,
  // This is to be removed soon
  postDefaultPOSTResponse : function(req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of POST response!', });
  },
  postDefaultGETResponse : function (req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of GET response!', });
  }
}
