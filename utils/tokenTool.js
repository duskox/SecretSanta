var jwt = require('jsonwebtoken');

function getTokenForUserEmail(email) {
  return jwt.sign({data:email}, process.env.TOKEN_SECRET);
}