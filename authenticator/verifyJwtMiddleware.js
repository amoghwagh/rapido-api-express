require('dotenv').config();

const jwt = require('jsonwebtoken');
const createError = require('http-errors');

function verifyToken(req, res, next) {
  try {
    jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
    next();
  } catch (err) {
    next(createError(403, 'You are not Authorized to access'));
  }
}

module.exports = verifyToken;
