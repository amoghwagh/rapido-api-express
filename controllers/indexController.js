const Joi = require('joi');
const bcrypt = require('bcrypt');
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
  res.render('index', { title: 'Rapido' });
}

function validateLogin(req, res) {
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
        if (result.length === 0) {
          res.status(404);
          res.render('index', { status: 'USERNAME NOT FOUND' });
        } else {
          bcrypt.compare(loginUser.password, result[0].password, (err, check) => {
            if (check === true) {
              res.send('Authenticated');
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
