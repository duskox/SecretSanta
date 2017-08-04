var bcrypt = require('bcryptjs');

module.exports = {getHashForString, verifyStringWithHash};

// var salt = bcrypt.genSaltSync(process.env.BCRYPTJS_SALT);
var salt = bcrypt.genSaltSync(10);

function getHashForString(string) {
  return bcrypt.hashSync(string, salt);
}

function verifyStringWithHash(string, hash) {
  var result = false;
  result = bcrypt.compareSync(string, hash);
  return result;
}
