var postgresDB = require('pg');
var reqUtil = require('./utils/requestUtils');
var hashTool = require('./utils/hashTool');
var tokenTool = require('./utils/tokenTool');
var dbHelper = require('./dbHelper');
var util = require('./utils/util');

module.exports = {
  // addUser,
  // getOrganisationInfo,
  registerNewUser,
  // listOfOrganisations,
  assignUserToOrganisation,
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

// function addUser(req,res) {
//   const payload = req.body;
//     if (!payload.email || !payload.password) {
//       const errorMessage = { message: "Register call with invalid parameters" };
//       res.status(400).send(errorMessage);
//       return;
//     }

//     if (!validator.isEmail(payload.email)) {
//       res.status(400).send({ message: "Invalid email!" });
//       return;
//     }

//     var passHash = hashTool.getHashForString(payload.password);
//     var userToken = tokenTool.getTokenForUserEmail(payload.email);

//     dbHelper
//       .insertUser(payload.name, payload.email, passHash)
//       .then(() => {
//         return dbHelper
//           .getAllActiveOrganisations();
//       })
//       .then((organisations) => {
//         res.status(200).send({ token: userToken, organisations: organisations });
//         return;
//       })
//       .catch(res.status(500));
// }

// Temporary method, just for testing
// function insertUser(req,res) {
//   const payload = req.body;
//   console.log("BLAAAAAAAAAAAAAAAA:", payload);
//   dbHelper.insertUser(payload.name, payload.email, payload.firstName, payload.lastName, payload.accessToken, payload.serverAuthCode)
//     .then((result) => {
//       console.log("Rezultat:", result);
//       res.status(200).send({ user_id: result });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500);
//     });
// }

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
        console.log("Error: ", err)
        res.status(500)
      });
}

// function getOrganisationInfo(req, res) {
//   const payload = req.body;
//   if (!payload.organisation_id || !payload.token) {
//     const errorMessage = { message: "Register call with invalid parameters" };
//     res.status(400).send(errorMessage);
//     return;
//   }

// }

// function verifyToken(req, res) {
//   const payload = req.body;
//   if (!payload.token) {
//     const errorMessage = { message: "Register call with invalid parameters" };
//     res.status(400).send(errorMessage);
//     return;
//   }

//   tokenTool.validateToken(payload.token, (err, decoded) => {
//     if (err) {
//       console.error(err);
//       res.status(400).send({ tokenValid: false });
//       return;
//     }
//     if (decoded) {
//       res.status(200).send({ tokenValid: true });
//       return;
//     }
//   });
// }

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

  // OLD CODE - where I had my own user token, not google one
  // tokenTool.validateToken(payload.token, (err, decoded) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(400).send({ tokenValid: false });
  //   }
  //   if (decoded) {
  //     var email = decoded;
  //     var user_id;
  //     dbHelper.getUserIdForEmail(email)
  //     .then((userId) => {
  //       user_id = userId;
  //       return dbHelper.getOrganisationDetails(payload.organisation_id);
  //     })
  //     .then((organisation) => {
  //       var deadlineDate = new Date(organisation.deadline);
  //       var today = new Date();
  //       if(today > deadlineDate) {
  //         return;
  //       } else {
  //         return dbHelper.leaveOrganisation(payload.user_id, payload.organisation_id);
  //       }
  //     })
  //     .then(() => {
  //       return dbHelper.getAllActiveOrganisations();
  //     })
  //     .then((organisations) => {
  //       res.status(200).send({ "organisations": organisations });
  //       return;
  //     })
  //     .catch((err) => console.error(err));
  //   }
  // });
}

function listOfOrganisations(req, res) {
  const payload = req.body;

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
      // console.log("Result of joining organisation:", result)
      if (result === -1) {
        res.status(500);
        return -1
      }
      return dbHelper.getOrganisationDetails(payload.organisation_id);
    })
    .then((org_details) => {
      // console.log("getOrganisationDetails result:", org_details);
      res.status(200).send(org_details);
    })
    .catch((err) => {
      console.log("santaController.joinOrganisation err:", err)
      res.status(500);
      return;
    });

  // dbHelper.joinOrganisation(payload.user_id, payload.organisation_id)
  //   .then((result) => {
  //     console.log("RES:", result);
  //     res.status(200).send(result);
  //     return;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500);
  //     return;
  //   });
}

// function loginUser(req, res) {
//   const payload = req.body;
//   if (!payload.email || !payload.password) {
//     const errorMessage = { message: "Register call with invalid parameters" };
//     res.status(400).send(JSON.stringify(errorMessage));
//     return;
//   }

//   dbHelper
//     .getUserRecord(payload.email)
//     .then((row) => {
//       var passCorrect = hashTool.verifyStringWithHash(payload.password, row.password);
//       if (!passCorrect) {
//         res.status(400).send({ error: "Incorrect password!" });
//         return;
//       }
//       return dbHelper.isUserPartOfOrganisation(row.id); // check if part of Organisation
//       }
//     )
//     .then((membershipRows) => {
//       if(membershipRows.length > 0) {
//         // YES: then return details of the organisation and token
//         var userToken = tokenTool.getTokenForUserEmail(payload.email);
//         dbHelper.getOrganisationDetails(membershipRows[0].org_id)
//               .then((organisationDetails) => {
//                 res.status(200).send({ "token": userToken, "organisation": organisationDetails })
//                 return;
//               })
//               .catch((err) => console.error(err));
//       } else {
//         // NO: return list of organisations and token
//         var userToken = tokenTool.getTokenForUserEmail(payload.email);
//         dbHelper.getAllActiveOrganisations()
//               .then((organisations) => {
//                 res.status(200).send({ "token": userToken, "organisations": organisations });
//                 return;
//               })
//               .catch((err) => console.error(err));
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500);
//     });
// }
