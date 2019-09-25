const jwt = require('jwt');

function verifyToken(req, res, next) {
  console.log(req.cookies.jwt);
  if (req.cookies.jwt) {
    console.log('YES');
    next();
  } else {
    res.status(403).send('You are not Authorized!!');
  }
}

module.exports = verifyToken;
