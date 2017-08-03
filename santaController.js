var postgresDB = require('pg');
var reqUtil = require('./utils/requestUtils')

module.exports = {
  getAsignee : function(req, res){
     // ovdje je funkcija koja za jedan ulaz uvijek daje izlaz, lako za test
  },
  addUser : function(req, res){
    reqUtil.logRequestContents(req);

     const payload = req.body;
     if (!payload.email && !payload.password) {
       const errorMessage = { message: "Missing parameters (email, password)" };
       res.status(400).send(JSON.stringify(errorMessage));
       return;
     }

     res.status(200).send(JSON.stringify(payload));
  },
  postMovie : function(req, res){
     //do something
  },
  postDefaultPOSTResponse : function(req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of POST response!', });
  },
  postDefaultGETResponse : function (req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of another GET response!', });
  },
  returnOrganisationInfo : function (req, res) {
    // TODO: search organisation passed and return its details, REQUEST MUST HAVE CORRECT USER TOKEN
  },
  returnListOfOrganisations : function (req, res) {
    // TODO: return list of organisations, REQUEST MUST HAVE CORRECT USER TOKEN

  },
  assignUserToOrganisation : function (req, res) {
    // TODO: assign a user to an organisation, REQUEST MUST HAVE CORRECT USER TOKEN
  },
  createNewOrganisation : function (req, res) {
    // TODO: create new organisation, REQUEST MUST HAVE CORRECT USER TOKEN
  },
  loginUser : function (req, res) {
    // verify email and password and respond with USER TOKEN
  },
  registerNewUser : function (req, res) {
    // create new account and respond with USER TOKEN and a list of organisations
  },

  // *** MOCK functions below !!!!
  MOCKreturnOrganisationInfo : function (req, res) {
    // "orgdetails":{"orgname":"name","party":"10-01-2018 21:00"} <--- deadline passed
    // "orgdetails":{"orgname":"name1","deadline":"01-01-2018 12:30","party":"10-01-2018 21:00"} <--- deadline not reached
    const mockResponse = {
      "orgdetails":{"orgname":"name1","deadline":"01-01-2018 12:30","party":"10-01-2018 21:00"}
    };
    res.status(200).send(mockResponse);
  },
  MOCKreturnListOfOrganisations : function (req, res) {
    const mockResponse = {
      "orglist":["Berlin 2018","Munchen 2018","Helsinki 2018"]
    };
    res.status(200).send(mockResponse);
  },
  MOCKassignUserToOrganisation : function (req, res) {
    const mockResponse = {
      "orgdetails":{"orgname":"name1","deadline":"01-01-2018 12:30","party":"10-01-2018 21:00"}
    };
    res.status(200).send(mockResponse);
  },
  MOCKcreateNewOrganisation : function (req, res) {
    const mockResponse = {
      "orgdetails":{"orgname":"name1","deadline":"01-01-2018 12:30","party":"10-01-2018 21:00"}
    };
    res.status(200).send(mockResponse);
  },
  MOCKloginUser : function (req, res) {
    // "usertoken":"token","orglist":["Berlin 2018","Munchen 2018","Helsinki 2018"] <--- no joined organisation
    // "usertoken":"token","orgdetails:{"orgname":"name1","deadline":"01-01-2018 12:30","party":"10-01-2018 21:00"} <--- joined and deadline active
    // "usertoken":"token","orgdetails:{"orgname":"name1","party":"10-01-2018 21:00"} <--- joined and deadline passed
    const mockResponse = {
      "usertoken":"token","orglist":["Berlin 2018","Munchen 2018","Helsinki 2018"]
    };
    res.status(200).send(mockResponse);
  },
  MOCKregisterNewUser : function (req, res) {
    const mockResponse = {
      "usertoken":"token","orglist":["Berlin 2018","Munchen 2018","Helsinki 2018"]
    };
    res.status(200).send(mockResponse);
  },
}
