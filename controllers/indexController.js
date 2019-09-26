const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersValidator = require('../validations/users');

const loginQuery = require('../queries/index');

function showMainPage(req, res) {
  res.render('index');
}

async function validateLogin(req, res, next) {
  const loginUser = {
    user_name: req.body.uname,
    password: req.body.passwd
  };
  const { error } = Joi.validate(loginUser, usersValidator);

  if (error === null) {
    try {
      const result = await loginQuery(loginUser.user_name);
      if (result.length === 0) {
        res.render('index', { status: 'USERNAME NOT FOUND' });
        res.status(404);
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
            res.render('index', { status: 'INVALID PASSWORD!' });
            res.status(404);
          }
        });
      }
    } catch (err) {
      res.render('index', { status: 'LOGIN UNSUCCESSFUL! CHECK USERNAME' });
      res.status(404);
    }
  } else {
    res.render('index', { status: 'LOGIN UNSUCCESSFUL! CHECK VALIDATION!' });
    res.status(404);
  }
}

module.exports = {
  showMainPage,
  validateLogin
};
