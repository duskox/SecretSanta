var postgresDB = require('pg');

module.exports = insertUser,insertUserToken;

function getDBClient() {
  var databaseClient = null;
  postgresDB.defaults.ssl = false; // true if heroku, false if local !!!
  postgresDB.connect(process.env.LOCAL_DATABASE_URI, function(err, client) {
    if (err) throw err;
    console.log('Connected to database.');
    databaseClient = client;
  });
  return databaseClient;
}

function insertUser(name, email, password) {
  var dbClient = getDBClient();
  var sqlResult;
  var query = "INSERT INTO users (email, password, name) VALUES (" + email + "," + password + "," + name + ");"
  dbClient.query(query, function(err, result) {
    if (err) {
      console.err("Could not complete query:", err);
      return -1;
    }
    sqlResult = result;
    console.log(result.rows[0].fieldName);
  });
  dbClient.end();
  return sqlResult;
}

function insertUserToken(user_id, token) {
  var dbClient = getDBClient();
  var query = "INSERT INTO user_tokens (user_id, token) VALUES (" + user_id + "," + token + ");"
  dbClient.query(query, function(err, result) {
    if (err) {
      return console.err("Could not complete query:", err);
    }
    console.log(result.rows[0].fieldName);
  });
  dbClient.end();
}

function insertOrganisation(name, deadline, party, location) {
  var dbClient = getDBClient();
  var query = "INSERT INTO organisations (name, deadline, party, location) VALUES (" + name + "," + deadline + "," + party + "," + location + ");"
  dbClient.query(query, function(err, result) {
    if (err) {
      return console.err("Could not complete query:", err);
    }
  });
  dbClient.end();
}

function joinOrganisation(user_id, organisation_id) {
  var dbClient = getDBClient();
  var query = "INSERT INTO memberships (user_id, organisation_id) VALUES (" + user_id + "," + organisation_id + ");"
  dbClient.query(query, function(err, result) {
    if (err) {
      return console.err("Could not complete query:", err);
    }
  });
  dbClient.end();
}

function leaveOrganisation(user_id, organisation_id) {
  var dbClient = getDBClient();
  var query = "DELETE FROM memberships (user_id, organisation_id) VALUES (" + user_id + "," + organisation_id + ");"
  dbClient.query(query, function(err, result) {
    if (err) {
      return console.err("Could not complete query:", err);
    }
  });
  dbClient.end();
}

function getAllUsersInOrganisation(organisation_id) {
  var dbClient = getDBClient();
  var results;
  var query = "SELECT * FROM memberships WHERE organisation_id =" + organisation_id + ";"
  dbClient.query(query, function(err, result) {
    if (err) {
      return console.err("Could not complete query:", err);
    }
    results = result;
    console.log(result.rows[0].fieldName);
  });
  dbClient.end();
  return results;
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
