function validateEmail(email) {
  var validEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  var validFuturiceDomain = /@futurice.com\s*$/;

  return validEmail.test(email) && validFuturiceDomain.test(email);
}

module.exports = {
  validateEmail,
}