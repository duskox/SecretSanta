var jwt = require('jsonwebtoken');

module.exports = {getTokenForUserEmail};

function getTokenForUserEmail(email) {
  return jwt.sign({data:email}, process.env.TOKEN_SECRET);
}