var postgresDB = require('pg');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.LOCAL_DATABASE_URI,
  searchPath: 'knex,public'
});

module.exports = { insertUser,
                  insertUserToken,
                  getUserIdForEmail,
                  verifyUserToken
                };

// function getDBClient() {
//   var databaseClient = null;
//   postgresDB.defaults.ssl = false; // true if heroku, false if local !!!
//   postgresDB.connect(process.env.LOCAL_DATABASE_URI, function(err, client) {
//     if (err) throw err;
//     console.log('Connected to database.');
//     databaseClient = client;
//   });
//   return databaseClient;
// }

function insertUser(name, email, password) {
  return knex('users')
    .insert({ email: email, name: name, password: password })
    .returning('id')
    .then((response) => {
      console.log("USER_ID:", response[0]);
      return response[0];
    })
    .catch((err) => {
      console.error(err);
    });
}

function insertUserToken(user_id, token) {
  return knex('user_tokens')
    .insert({ user_id:user_id, token:token })
    .then((response) => {
      console.log("inserting token:", response);
      return true;
    })
    .catch((err) => {
      console.error(err);
    });
}

function insertOrganisation(name, deadline, party, location) {
  return knex('organisations')
    .insert({ name: name, deadline, deadline, party: party, location, location })
    .returning('id')
    .then((response) => {
      return response[0];
    })
    .catch((err) => {
      console.error(err);
    });
}

function joinOrganisation(user_id, organisation_id) {
  return knex('memberships')
    .insert({ user_id: user_id, org_id: organisation_id })
    then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
    });
}

function isUserPartOfOrganisation(user_id) {
  return knex.select('org_id')
    .from('memberships')
    .where({ user_id: user_id })
    .then((rows) => {
      return rows;
    })
    .catch((err) => {
      console.error(err);
    });
}

function leaveOrganisation(user_id, organisation_id) {

}

function getAllUsersInOrganisation(organisation_id) {

}

function getUserIdForEmail(email) {
  return knex.select('id')
    .from('users')
    .where({ email: email })
    .then((rows) => {
      return rows[0].id;
    })
    .catch((err) => {
      console.error(err);
    });
}

function verifyUserToken(user_token, user_id) {
  return knex.count('user_id')
    .from('user_tokens')
    .where({ token: user_token, user_id: user_id })
    .then((result) => {
      return result[0].count;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getAllActiveOrganisation() {
  var result;

  return result;
}

function verifyUser(email, password) {
  var result = false;

  return result;
}

function getOrganisationDetails(org_id) {
  var result;

  return result;
}

function insertSantaKidPair(santa_user_id, kid_user_id, org_id) {
  var result = false;

  return result;
}
