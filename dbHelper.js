var postgresDB = require('pg');
var knex = require('knex')({
  client: 'pg',
  // connection: process.env.DATABASE_URL,
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  searchPath: 'knex,public',
  debug: true,
  ssl: true,
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

/*
 *     #     #
 *     #     #  ####  ###### #####   ####
 *     #     # #      #      #    # #
 *     #     #  ####  #####  #    #  ####
 *     #     #      # #      #####       #
 *     #     # #    # #      #   #  #    #
 *      #####   ####  ###### #    #  ####
 */

function insertUser(name, email, firstName, lastName, accessToken, serverAuthCode) {
  console.log("In insertUser");
  console.log('HOST:', process.env.DB_HOST);
  console.log('NAME:', process.env.DB_NAME);
  console.log('USER:', process.env.DB_USER);
  console.log('PASS:', process.env.DB_PASS);
  console.log('PORT:', process.env.DB_PORT);
  return knex('users')
    .insert({ email: email, name: name,  first_name: firstName, last_name: lastName, access_token: accessToken, server_auth_code: serverAuthCode})
    .returning('id')
    .then((response) => {
      console.log('REZULTAT:', response);
      return response[0];
    })
    .catch((err) => {
      console.error("GRESKA:",err);
      return -1;
    });
}

function findAndUpdateUserData(name, email, firstName, lastName, accessToken, serverAuthCode) {
  console.log("In findAndUpdateUserData");
  return knex('users')
    .where('email', email)
    .then((userRow) => {
      console.log(userRow);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getUserIdForEmail(email) {
  console.log("In getUserIdForEmail");
  console.log("Environment:", process.env.DATABASE_URL);
  return knex.select('id')
    .from('users')
    .where({ email: email })
    .then((rows) => {
      if (rows.length === 0) {
        return -1;
      }
      return rows[0].id;
    })
    .catch((err) => {
      console.error(err);
      return -1;
    });
}

function updateUser(name, email, firstName, lastName, accessToken, serverAuthCode) {
  console.log("In updateUser");
  return knex('users')
    .where('email', '=', email)
    .update({
      name: name,
      first_name: firstName,
      last_name: lastName,
      access_token: accessToken,
      server_auth_code: serverAuthCode
    });
}

function getUserRecord(email) {
  console.log("In getUserRecord");
  return knex('users')
    .where('email', email)
    .then((rows) => {
      return rows[0];
    })
    .catch((err) => {
      console.error(err);
    });
}

/*
 *     #######
 *     #     # #####   ####    ##   #    # #  ####    ##   ##### #  ####  #    #  ####
 *     #     # #    # #    #  #  #  ##   # # #       #  #    #   # #    # ##   # #
 *     #     # #    # #      #    # # #  # #  ####  #    #   #   # #    # # #  #  ####
 *     #     # #####  #  ### ###### #  # # #      # ######   #   # #    # #  # #      #
 *     #     # #   #  #    # #    # #   ## # #    # #    #   #   # #    # #   ## #    #
 *     ####### #    #  ####  #    # #    # #  ####  #    #   #   #  ####  #    #  ####
 */

function insertOrganisation(name, deadline, party, location, user_id) {
  console.log("In insertOrganisation");
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
  console.log("In joinOrganisation");
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
  console.log("In isUserPartOfOrganisation");
  return knex.select('org_id')
    .from('memberships')
    .where({ user_id: user_id })
    .then((rows) => {
      return rows;
    })
    .catch((err) => {
      console.error(err);
      return -1;
    });
}

function getAllActiveOrganisations() {
  console.log("In getAllActiveOrganisations");
  return knex('organisations')
    .then((rows) => {
      return rows;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getOrganisationDetails(org_id) {
  console.log("In getOrganisationDetails");
  return knex('organisations')
    .where('id', org_id)
    .then((rows) => {
      return rows[0];
    })
    .catch((err) => console.error(err));
}

function leaveOrganisation(user_id, organisation_id) {
  console.log("In leaveOrganisation");
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

function insertSantaKidPair(santa_user_id, kid_user_id, org_id) {

}
