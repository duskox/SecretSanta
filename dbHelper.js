var postgresDB = require('pg');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.LOCAL_DATABASE_URI,
  searchPath: 'knex,public'
});

module.exports = { insertUser,
                  getUserIdForEmail,
                  getUserRecord,
                  getAllActiveOrganisations,
                  insertOrganisation,
                  joinOrganisation,
                  isUserPartOfOrganisation,
                  getOrganisationDetails,
                  leaveOrganisation
                };

function insertUser(name, email, firstName, lastName, accessToken, serverAuthCode) {
  return knex('users')
    .insert({ email: email, name: name,  first_name: firstName, last_name: lastName, access_token: accessToken, server_auth_code: serverAuthCode})
    .returning('id')
    .then((response) => {
      return response[0];
    })
    .catch((err) => {
      console.error(err);
    });
}

function insertOrganisation(name, deadline, party, location, user_id) {
  return knex('organisations')
    .insert({ name: name, deadline, deadline, party: party, location, location })
    .returning('id')
    .then((response) => {
      return knex('memberships')
        .insert({ org_id: response[0], user_id: user_id })
        .returning('org_id');
    })
    .then((org_id) => {
      return knex('organisations')
        .where('id', org_id[0]);
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

function getAllActiveOrganisations() {
  return knex('organisations')
          .then((rows) => {
            return rows;
          })
          .catch((err) => {
            console.error(err);
          });
}

function getUserRecord(email) {
  return knex('users')
          .where('email', email)
          .then((rows) => {
            return rows[0];
          })
          .catch((err) => {
            console.error(err);
          });
}

function getOrganisationDetails(org_id) {
  return knex('organisations')
          .where('id', org_id)
          .then((rows) => {
            return rows[0];
          })
          .catch((err) => console.error(err));
}

function insertSantaKidPair(santa_user_id, kid_user_id, org_id) {

}

function leaveOrganisation(user_id, organisation_id) {
  return knex('memberships')
    .where('user_id', user_id)
    .andWhere('org_id', organisation_id)
    .del()
    .then((rowsDeleted) => {
      return rowsDeleted;
    })
    .catch((err) => console.error(err));
}

function getAllUsersInOrganisation(organisation_id) {

}