const bcrypt = require('bcrypt');
const Joi = require('joi');

const sqlConnection = require('../config/connection');

const usersValidator = require('../validations/register');

function renderPage(req, res) {
  res.render('register');
}

function register(req, res) {
  const newUser = {
    user_name: req.body.uname,
    password: req.body.passwd,
    email: req.body.email
  };
  const { error } = Joi.validate(newUser, usersValidator);

  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(newUser.password, salt);
  newUser.password = hashedPass;

  if (error === null) {
    sqlConnection.query(
      'INSERT INTO users(user_name,password,email) VALUES (?,?,?)',
      Object.values(newUser),
      err => {
        if (err) {
          res.status(404);
          res.render('register', {
            status: 'Register Unsuccessful! Please try a new Username'
          });
        } else {
          res.render('register', { status: 'Register Successful!' });
        }
      }
    );
  } else {
    res.status(400);
    res.render('register', { status: 'Register Unsuccessful! Check Validation!' });
  }
}

module.exports = {
  renderPage,
  register
};
