const bcrypt = require('bcrypt');
const Joi = require('joi');

const usersValidator = require('../validations/register');
const registerQuery = require('../queries/register');

function renderPage(req, res) {
  res.render('register');
}

async function register(req, res) {
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
    try {
      await registerQuery(Object.values(newUser));
      res.render('register', { status: 'REGISTER SUCCESSFUL!' });
    } catch (err) {
      res.status(404);
      res.render('register', {
        status: 'REGISTER UNSUCCESSFUL! PLEASE TRY A NEW USERNAME'
      });
    }
  } else {
    res.status(400);
    res.render('register', { status: 'REGISTER UNSUCCESSFUL! CHECK VALIDATION!' });
  }
}

module.exports = {
  renderPage,
  register
};
