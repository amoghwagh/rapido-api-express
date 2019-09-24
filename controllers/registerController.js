const bcrypt = require('bcrypt');
const Joi = require('joi');

const sqlConnection = require('../config/connection');

const usersValidator = Joi.object({
  user_name: Joi.string()
    .alphanum()
    .required(),
  password: Joi.string()
    .required()
    .min(3)
    .max(20),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
});

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
      (err, results) => {
        if (results.affectedRows === 0) {
          res.status(404);
          res.render('register', { status: 'Register Unsuccessful!' });
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
  register
};
