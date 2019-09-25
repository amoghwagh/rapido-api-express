const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlConnection = require('../config/connection');

const usersValidator = Joi.object({
  user_name: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string()
    .required()
    .min(3)
    .max(20)
});

function showMainPage(req, res) {
  res.render('index');
}

function validateLogin(req, res, next) {
  const loginUser = {
    user_name: req.body.uname,
    password: req.body.passwd
  };
  const { error } = Joi.validate(loginUser, usersValidator);

  if (error === null) {
    sqlConnection.query(
      'SELECT password FROM users where user_name = ?',
      loginUser.user_name,
      (err, result) => {
        if (err) next(err);
        if (result.length === 0) {
          res.status(404);
          res.render('index', { status: 'USERNAME NOT FOUND' });
        } else {
          bcrypt.compare(loginUser.password, result[0].password, (err, check) => {
            if (check === true) {
              const jwtUser = {
                user_name: loginUser.user_name
              };
              const token = jwt.sign({ jwtUser }, 'NotASecretAnymore', { expiresIn: '1h' });
              res.cookie('jwt', token);
              res.render('index', {
                status: 'Token Is Generated! You have access to the endpoints for 1 hour from now.'
              });
            } else {
              res.send('Invalid Password!');
            }
          });
        }
      }
    );
  } else {
    res.status(400);
    res.render('index', { status: 'Login Unsuccessful! Check Validation!' });
  }
}

module.exports = {
  showMainPage,
  validateLogin
};
