var postgresDB = require('pg');
var knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
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
                  leaveOrganisation,
                  getAllUsersInOrganisation,
                  getSecretSantaPairForUserId,
                  getUserForId,
                  getKidName,
                  getAllUsersInTheOrganisation,
                  insertSantaKidPairs
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
  return knex('users').where({ email: email })
    .select('id')
    .then((rows) => {
      if (rows.length === 0) {
        console.log("Returning -1")
        return -1;
      }
      console.log("Returning:", rows[0])
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
    .where({ email: email})
    .update({
      name: name,
      first_name: firstName,
      last_name: lastName,
      access_token: accessToken,
      server_auth_code: serverAuthCode
    })
    .returning('id');
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

function getSecretSantaPairForUserId(userId) {
  console.log("In getSecretSantaPairForUserId");
  return knex('secretsantas')
    .where('santa_user_id', userId)
    .then((rows) => {
      console.log("U DB helperu, rows u secretsantapairs:", rows)
      return rows;
    })
    .catch((err) => {
      console.error(err);
    });
}

function getUserForId(userId) {
  console.log("In getUserForId");
  return knex('users')
    .where('id', userId)
    .then((rows) => {
      return rows;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    })
}

function getKidName(santaId) {
  console.log("In getKidName")
  return new Promise((resolve, reject) => {
    getSecretSantaPairForUserId(santaId)
    .then((result) => {
      console.log("In getKidName RESULT:", result)
      if (result.length < 1) {
        console.log("RESOLVING 1")
        resolve(-1);
      } else {
        getUserForId(result[0].kid_user_id)
          .then((result) => {
            console.log("RESOLVING 2", result)
            resolve(result)
          })
          .catch((err) => {
            console.log("REJECTING 1")
            reject(err)
          })
      }
    })
    .catch((err) => {
      console.log("REJECTING 2")
      console.log("Error",err)
      reject(err)
    })
  })

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
    .insert({ user_id: user_id, org_id: organisation_id, validity_date: '2099-01-01' })
    then((response) => {
      console.log("joinOrganisation response success:", response);
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
      return -1;
    });
}

function isUserPartOfOrganisation(user_id) {
  console.log("In isUserPartOfOrganisation user_id:", user_id);
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
  console.log("In getAllUsersInOrganisation");
  return knex('memberships')
    .where('org_id', organisation_id)
    then((response) => {
      return response;
    })
    .catch((err) => {
      console.error(err);
      throw err;
      return -1;
    });
}

function insertSantaKidPairs(pairsArr) {
  console.log("In insertSantaKidPairs")
  return knex('secretsantas').insert(pairsArr);
}

function getAllUsersInTheOrganisation(org_id) {
    console.log("In getAllUsersInTheOrganisation");
    return knex
      .select('users.email', 'users.id', 'users.name')
      .from('users')
      .join('memberships', 'users.id', 'memberships.user_id')
      .where('memberships.org_id', org_id);
}
