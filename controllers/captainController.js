/* eslint-disable func-names */
// const customerModel = require('../models/customer');

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const sqlConnection = require('../config/connection');
const formatDate = require('../utils/formatDate');
const currentDateTime = require('../utils/currentDateTime');

const captainsValidator = Joi.object({
  first_name: Joi.string()
    .alphanum()
    .required(),
  last_name: Joi.string()
    .alphanum()
    .required(),
  gender: Joi.string()
    .valid('M', 'F')
    .required(),
  dob: Joi.date()
    .iso()
    .required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  date_joined: Joi.required()
});

function captainsInformation(req, res, next) {
  sqlConnection.query('SELECT * FROM captains', function(err, result) {
    if (err) next(err);
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('captains', { result });
    }
  });
}

function addCaptains(req, res, next) {
  try {
    jwt.verify(req.cookies.jwt, 'NotASecretAnymore');
    const newCaptain = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      dob: req.body.dob,
      email: req.body.email
    };
    newCaptain.dob = formatDate(newCaptain.dob);
    newCaptain.date_joined = currentDateTime();
    const { error } = Joi.validate(newCaptain, captainsValidator);
    if (error === null) {
      sqlConnection.query(
        'INSERT INTO captains(first_name,last_name,gender,dob,email,date_joined) VALUES (?,?,?,?,?,?)',
        Object.values(newCaptain),
        (err, results) => {
          if (err) next(err);
          if (results.affectedRows === 0) {
            res.status(404);
            res.send('INSERT UNSUCCESSFUL!');
          } else {
            res.send(newCaptain);
          }
        }
      );
    } else {
      res.status(400);
      res.send('Validation Error! Check Input parameters');
    }
  } catch (err) {
    res.status(403).send('You are not Authorized to access');
  }
}

function singleCaptainsInformation(req, res, next) {
  sqlConnection.query('SELECT * from captains where cid= ?', req.params.id, (err, result) => {
    if (err) next(err);
    if (result.length !== 0) {
      res.render('captains', { result });
    } else {
      res.status(404);
      res.send('ID Not Found');
    }
  });
}

function updateCaptainsInformation(req, res, next) {
  try {
    jwt.verify(req.cookies.jwt, 'NotASecretAnymore');
    const updatedInfo = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      dob: req.body.dob,
      email: req.body.email,
      date_joined: req.body.date_joined
    };
    const { error } = Joi.validate(updatedInfo, captainsValidator);

    updatedInfo.dob = formatDate(updatedInfo.dob);
    const queryValues = Object.values(updatedInfo);
    queryValues[queryValues.length - 1] = req.params.id;
    if (error === null && queryValues.length === 6) {
      sqlConnection.query(
        'UPDATE captains SET first_name = ? , last_name = ?, gender = ?, dob = ?, email = ? WHERE cid = ? ',
        queryValues,
        (err, result) => {
          if (err) next(err);
          if (result.affectedRows === 0) {
            res.status(404);
            res.send('Update Unsuccessful! Check the input');
          } else {
            res.send(updatedInfo);
          }
        }
      );
    } else {
      res.status(400);
      res.send('Validation Error! Check Input parameters');
    }
  } catch (err) {
    res.status(403).send('You are not Authorized to access');
  }
}

function deleteCaptainsInformation(req, res, next) {
  try {
    jwt.verify(req.cookies.jwt, 'NotASecretAnymore');
    sqlConnection.query('DELETE from captains where cid= ?', req.params.id, (err, result) => {
      if (err) next(err);
      if (result.affectedRows === 0) {
        res.status(404);
        res.send('DELETE UNSUCCESSFUL!');
      } else {
        res.send('DELETE SUCCESSFUL!');
      }
    });
  } catch (err) {
    res.status(403).send('You are not Authorized to access');
  }
}

module.exports = {
  captainsInformation,
  addCaptains,
  singleCaptainsInformation,
  updateCaptainsInformation,
  deleteCaptainsInformation
};
