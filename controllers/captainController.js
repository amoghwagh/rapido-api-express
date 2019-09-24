/* eslint-disable func-names */
// const customerModel = require('../models/customer');

const Joi = require('joi');
const sqlConnection = require('../config/connection');

function formatDate(date) {
  const formatedMysqlString = new Date(
    new Date(new Date(new Date(date)).toISOString()).getTime() -
      new Date(date).getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 10)
    .replace('T', ' ');
  return formatedMysqlString;
}

function currentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  if (month.toString().length === 1) {
    month = `0${month}`;
  }
  if (day.toString().length === 1) {
    day = `0${day}`;
  }
  if (hour.toString().length === 1) {
    hour = `0${hour}`;
  }
  if (minute.toString().length === 1) {
    minute = `0${minute}`;
  }
  if (second.toString().length === 1) {
    second = `0${second}`;
  }
  const dateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return dateTime;
}

const captainsValidator = Joi.object({
  first_name: Joi.string()
    .alphanum()
    .required(),
  last_name: Joi.string()
    .alphanum()
    .required(),
  gender: Joi.string().required(),
  dob: Joi.string().required(),
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

function addCaptains(req, res) {
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
}

function singleCaptainsInformation(req, res) {
  sqlConnection.query('SELECT * from captains where cid= ?', req.params.id, (err, result) => {
    if (result.length !== 0) {
      res.render('captains', { result });
    } else {
      res.status(404);
      res.send('ID Not Found');
    }
  });
}

function updateCaptainsInformation(req, res) {
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
}

function deleteCaptainsInformation(req, res) {
  sqlConnection.query('DELETE from captains where cid= ?', req.params.id, (err, result) => {
    if (result.affectedRows === 0) {
      res.status(404);
      res.send('DELETE UNSUCCESSFUL!');
    } else {
      res.send('DELETE SUCCESSFUL!');
    }
  });
}

module.exports = {
  captainsInformation,
  addCaptains,
  singleCaptainsInformation,
  updateCaptainsInformation,
  deleteCaptainsInformation
};
