var jwt = require('jsonwebtoken');

export function getTokenForUserEmail(email) {
  return jwt.sign({data:email}, process.env.TOKEN_SECRET);
}