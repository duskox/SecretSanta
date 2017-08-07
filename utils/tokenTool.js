var jwt = require('jsonwebtoken');

module.exports = { getTokenForUserEmail,
                  validateToken
                 };

function getTokenForUserEmail(email) {
  return jwt.sign({data:email}, process.env.TOKEN_SECRET, { expiresIn: '7d'});
}

function validateToken(token, callback) {
  return jwt.verify(token, process.env.TOKEN_SECRET, callback);
}