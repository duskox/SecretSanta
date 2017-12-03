var postgresDB = require('pg');
var reqUtil = require('./utils/requestUtils');
var hashTool = require('./utils/hashTool');
var tokenTool = require('./utils/tokenTool');
var dbHelper = require('./dbHelper');
var util = require('./utils/util');

module.exports = {
  // addUser,
  // getOrganisationInfo,
  // registerNewUser,
  // listOfOrganisations,
  // assignUserToOrganisation,
  createOrganisationAddUserToIt,
  // loginUser,
  // verifyToken,
  leaveOrganisation,
  setUser,
  // insertUser,
  joinOrganisation,
// This is to be removed soon
postDefaultPOSTResponse : function(req, res) {
res.status(200).send({ message : 'Welcome to the beginning of POST response!', });
},
postDefaultGETResponse : function (req, res) {
res.status(200).send({ message : 'Welcome to the beginning of GET response!', });
}
}


function setUser(req,res) {
  const payload = req.body;
    if (!payload.email && !payload.name && !payload.accessToken && !payload.serverAuthCode && !payload.firstName && !payload.lastName) {
      const errorMessage = { message: "Call with invalid parameters!" };
      res.status(400).send(errorMessage);
      return;
    }

    if (!util.validateEmail(payload.email)) {
      res.status(400).send({ message: "Invalid email!" });
      return;
    }

    console.log("Before getID:", payload);
    dbHelper.getUserIdForEmail(payload.email)
      .then((id) => {
        if (id === -1) {
          return dbHelper
            .insertUser(payload.name, payload.email, payload.firstName, payload.lastName, payload.accessToken, payload.serverAuthCode);
        } else {
          return id
        }
      })
      .then((id) => {
        console.log("Before getSecretSantaPairForUserId:", payload);
        return new Promise((resolve, reject) => {
          dbHelper.getKidName(id)
          .then((result) => {
            console.log("Kakav je rezultat:", result)
            if (result == -1) {
              console.log("U -1 >>>>>>>>")
              resolve(id);
            } else {
              console.log("SALJEM REPLY:", result)
              res.status(200).send(result[0])
              reject()
            }
          })
          .catch((err) => {
            console.log("U prvom ketchu", err)
            throw err
          })
        })
      })
      .then((id) => {
        return dbHelper.isUserPartOfOrganisation(id)
      })
      .then((result) => {
        console.log("result:", result)
        if (result === -1 || result.length === 0) {
          dbHelper.getAllActiveOrganisations()
            .then((organisations) => {
              res.status(200).send({ organisations: organisations });
              return;
            })
        } else {
          const orgId = result[0].org_id
          dbHelper.getOrganisationDetails(orgId)
            .then((orgDetails) => {
              res.status(200).send(orgDetails)
              return
            })
        }
      })
      .catch((err) => {
        console.log("U drugom ketchu", err)
        if (err == 'CustomThrow') {
          // do nothing
        } else {
          console.log("Error: ", err)
          res.status(500)
        }
      });
}

function leaveOrganisation(req, res) {
  const payload = req.body;
  if (!payload.email ||
    !payload.organisation_id ||
    !payload.accessToken ||
    !payload.serverAuthCode
  ) {
    const errorMessage = { message: "Leave organisation call with invalid parameters" };
    res.status(400).send(errorMessage);
    return;
  }

  // here a check of token shoudl go

  dbHelper.getUserIdForEmail(payload.email)
    .then((user_id) => {
      return dbHelper.leaveOrganisation(user_id, payload.organisation_id)
    })
    .then((result) => {
      // console.log("Result of leaving organisation:", result)
      if (result === -1) {
        res.status(500);
        return -1
      }
      return dbHelper.getAllActiveOrganisations()
    })
    .then((active_organisations) => {
      // console.log("getAllActiveOrganisations result:", active_organisations);
      res.status(200).send(active_organisations);
    })
    .catch((err) => {
      // console.log("santaController.leaveOrganisation err:", err)
      res.status(500);
      return;
    });
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

function joinOrganisation(req, res) {
  const payload = req.body;
  if (!payload.email ||
    !payload.organisation_id ||
    !payload.accessToken ||
    !payload.serverAuthCode
  ) {
    const errorMessage = { message: "Register call with invalid parameters" };
    res.status(400).send(errorMessage);
    return;
  }

  // here I need to check user token and see if it is good, for now just do it with email

  dbHelper.getUserIdForEmail(payload.email)
    .then((user_id) => {
      return dbHelper.joinOrganisation(user_id, payload.organisation_id)
    })
    .then((result) => {
      if (result === -1) {
        res.status(500);
        return -1
      }
      return dbHelper.getOrganisationDetails(payload.organisation_id);
    })
    .then((org_details) => {
      res.status(200).send(org_details);
    })
    .catch((err) => {
      console.log("santaController.joinOrganisation err:", err)
      res.status(500);
      return;
    });
}
