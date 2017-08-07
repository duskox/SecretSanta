var postgresDB = require('pg');
var reqUtil = require('./utils/requestUtils');
var hashTool = require('./utils/hashTool');
var tokenTool = require('./utils/tokenTool');
var dbHelper = require('./dbHelper');
var validator = require('validtor');

function addUser(req,res) {
  const payload = req.body;
    if (!payload.email || !payload.password) {
      const errorMessage = { message: "Register call with invalid parameters" };
      res.status(400).send(errorMessage);
      return;
    }

    if (!validator.isEmail(payload.email)) {
      res.status(400).send({ message: "Invalid email!" });
      return;
    }

    var passHash = hashTool.getHashForString(payload.password);
    var userToken = tokenTool.getTokenForUserEmail(payload.email);

    dbHelper
      .insertUser(payload.name, payload.email, passHash)
      .then(() => {
        return dbHelper
          .getAllActiveOrganisations();
      })
      .then((organisations) => {
        var orgArr = [];
        for ( i = 0; i < organisations.length; i++) {
          org_id = organisations.id;
          name = organisations.name;
          orgArr.push({ "org_id": org_id, "name": name });
        }
        res.status(200).send({ token: userToken, organisations: orgArr });
        return;
      })
      .catch(res.status(500));
}

function isUserInOrganisation(req, res) {

}

function getOrganisationInfo(req, res) {
  const payload = req.body;
  console.log("Payload:", payload);
  if (!payload.organisation_id || !payload.token) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(JSON.stringify(errorMessage));
    return;
  }

}

function verifyToken(req, res) {
  const payload = req.body;
  console.log("Payload:", payload);
  if (!payload.token) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(JSON.stringify(errorMessage));
    return;
  }

  tokenTool.validateToken(payload.token, (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(400).send({ tokenValid: false });
    }
    if (decoded) {
      res.status(200).send({ tokenValid: true });
    }
  });
}

function returnListOfOrganisations(req, res) {

}

function registerNewUser(req, res) {

}

function assignUserToOrganisation(req, res) {

}
function createNewOrganisationAndAddUserToIt(req, res) {
  const payload = req.body;
  console.log("Payload:", payload);
  if (!payload.email ||
      !payload.token ||
      !payload.name ||
      !payload.deadline ||
      !payload.party ||
      !payload.location
    ) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(JSON.stringify(errorMessage));
    return;
  }

  if(!validator.isEmail(email)) {
    res.status(400).send({ message: "Invalid email!" });
    return;
  }

  if(!validator.isISO8601(deadline)) {
    res.status(400).send({ message: "Invalid deadline date!" });
    return;
  }

  if(!validator.isISO8601(party)) {
    res.status(400).send({ message: "Invalid party date!" });
    return;
  }

  var userValid = tokenTool.validateToken(payload.token);
  var user_id;

  dbHelper.getUserRecord(payload.email)
    .then((row) => {
      return dbHelper.insertOrganisation(payload.name, payload.deadline, payload.party, payload.location, row.id)
    })
    .then((rows) => {
      res.status(200).send(rows[0]);
      return;
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    })

}

function loginUser(req, res) {
  const payload = req.body;
  console.log("Payload:", payload);
  if (!payload.email || !payload.password) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(JSON.stringify(errorMessage));
    return;
  }

  dbHelper
    .getUserRecord(payload.email)
    .then((row) => {
      var passCorrect = hashTool.verifyStringWithHash(payload.password, row.password);
      if (passCorrect) {
        // TODO: check if part of Organisation
        // YES: then return details of the organisation
        // NO: return token and list of organisations
      } else {
        res.status(400).send({ error: "Incorrect password!" });
        return;
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
}

module.exports = { addUser,
                  getOrganisationInfo,
                  returnListOfOrganisations,
                  registerNewUser,
                  assignUserToOrganisation,
                  createNewOrganisationAndAddUserToIt,
                  loginUser,
                  verifyToken,
  // This is to be removed soon
  postDefaultPOSTResponse : function(req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of POST response!', });
  },
  postDefaultGETResponse : function (req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of GET response!', });
  }
}
