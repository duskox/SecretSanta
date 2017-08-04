var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(process.env.BCRYPTJS_SALT);

export function getHashForString(string) {
  return bcrypt.hashSync(string, salt);
}

export function verifyStringWithHash(string, hash) {
  var result = false;
  result = bcrypt.compareSync(string, hash);
  return result;
}