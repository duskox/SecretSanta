var postgresDB = require('pg');
var reqUtil = require('./utils/requestUtils');
var hashTool = require('./utils/hashTool');
var tokenTool = require('./utils/tokenTool');
var dbHelper = require('./dbHelper');
var validator = require('validator');

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
        res.status(200).send({ token: userToken, organisations: organisations });
        return;
      })
      .catch(res.status(500));
}

function isUserInOrganisation(req, res) {

}

function getOrganisationInfo(req, res) {
  const payload = req.body;
  if (!payload.organisation_id || !payload.token) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(errorMessage);
    return;
  }

}

function verifyToken(req, res) {
  const payload = req.body;
  if (!payload.token) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(errorMessage);
    return;
  }

  tokenTool.validateToken(payload.token, (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(400).send({ tokenValid: false });
      return;
    }
    if (decoded) {
      res.status(200).send({ tokenValid: true });
      return;
    }
  });
}

function leaveOrganisation(req, res) {
  const payload = req.body;
  if (!payload.organisation_id || !payload.user_id || !payload.token) {
    const errorMessage = { message: "Leave organisation call with invalid parameters" };
    res.status(400).send(errorMessage);
    return;
  }

  tokenTool.validateToken(payload.token, (err, decoded) => {
    if (err) {
      console.error(err);
      res.status(400).send({ tokenValid: false });
    }
    if (decoded) {
      var email = decoded;
      var user_id;
      dbHelper.getUserIdForEmail(email)
      .then((userId) => {
        user_id = userId;
        return dbHelper.getOrganisationDetails(payload.organisation_id);
      })
      .then((organisation) => {
        var deadlineDate = new Date(organisation.deadline);
        var today = new Date();
        if(today > deadlineDate) {
          return;
        } else {
          return dbHelper.leaveOrganisation(payload.user_id, payload.organisation_id);
        }
      })
      .then(() => {
        return dbHelper.getAllActiveOrganisations();
      })
      .then((organisations) => {
        res.status(200).send({ "organisations": organisations });
        return;
      })
      .catch((err) => console.error(err));
    }
  });
}

function returnListOfOrganisations(req, res) {

}

function registerNewUser(req, res) {

}

function assignUserToOrganisation(req, res) {

}

function createOrganisationAddUserToIt(req, res) {
  const payload = req.body;
  if (!payload.email ||
      !payload.token ||
      !payload.name ||
      !payload.deadline ||
      !payload.party ||
      !payload.location
    ) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(errorMessage);
    return;
  }

  if(!validator.isEmail(payload.email)) {
    res.status(400).send({ message: "Invalid email!" });
    return;
  }

  if(!validator.isISO8601(payload.deadline)) {
    res.status(400).send({ message: "Invalid deadline date!" });
    return;
  }

  if(!validator.isISO8601(payload.party)) {
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
  if (!payload.email || !payload.password) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(JSON.stringify(errorMessage));
    return;
  }

  dbHelper
    .getUserRecord(payload.email)
    .then((row) => {
      var passCorrect = hashTool.verifyStringWithHash(payload.password, row.password);
      if (!passCorrect) {
        res.status(400).send({ error: "Incorrect password!" });
        return;
      }
      return dbHelper.isUserPartOfOrganisation(row.id); // check if part of Organisation
      }
    )
    .then((membershipRows) => {
      if(membershipRows.length > 0) {
        // YES: then return details of the organisation and token
        var userToken = tokenTool.getTokenForUserEmail(payload.email);
        dbHelper.getOrganisationDetails(membershipRows[0].org_id)
              .then((organisationDetails) => {
                res.status(200).send({ "token": userToken, "organisation": organisationDetails })
                return;
              })
              .catch((err) => console.error(err));
      } else {
        // NO: return list of organisations and token
        var userToken = tokenTool.getTokenForUserEmail(payload.email);
        dbHelper.getAllActiveOrganisations()
              .then((organisations) => {
                res.status(200).send({ "token": userToken, "organisations": organisations });
                return;
              })
              .catch((err) => console.error(err));
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
                  createOrganisationAddUserToIt,
                  loginUser,
                  verifyToken,
                  leaveOrganisation,
  // This is to be removed soon
  postDefaultPOSTResponse : function(req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of POST response!', });
  },
  postDefaultGETResponse : function (req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of GET response!', });
  }
}
