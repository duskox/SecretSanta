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

    dbHelper
      .insertUser(payload.name, payload.email, passHash)
      .then((user_id) => {
        return dbHelper
          .insertUserToken(user_id, userToken);
      })
      .then(
        res.status(200).send(JSON.stringify({ token: userToken }))
      )
      .catch(res.status(500));
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
