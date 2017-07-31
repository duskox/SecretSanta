module.exports = {
  getAsignee : function(req, res){
     // ovdje je funkcija koja za jedan ulaz uvijek daje izlaz, lako za test
  },
  addUser : function(req, res){
     //do something
  },
  postMovie : function(req, res){
     //do something
  },
  postDefaultPOSTResponse : function(req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of POST response!', });
  },
  postDefaultGETResponse : function (req, res) {
    res.status(200).send({ message : 'Welcome to the beginning of another GET response!', });
  }
}
