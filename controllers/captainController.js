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
  if (month.toString().length == 1) {
    month = `0${month}`;
  }
  if (day.toString().length == 1) {
    day = `0${day}`;
  }
  if (hour.toString().length == 1) {
    hour = `0${hour}`;
  }
  if (minute.toString().length == 1) {
    minute = `0${minute}`;
  }
  if (second.toString().length == 1) {
    second = `0${second}`;
  }
  const dateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return dateTime;
}

const CaptainsValidator = Joi.object({
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
  member_since: Joi.required()
});

function captainsInformation(req, res, next) {
  sqlConnection.query('SELECT * FROM customers', function(err, result) {
    if (err) next(err);
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('customers', { result });
    }
  });
}

function addCaptains(req, res) {
  const newCustomer = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    dob: req.body.dob,
    email: req.body.email
  };
  newCustomer.dob = formatDate(newCustomer.dob);
  newCustomer.member_since = currentDateTime();
  const { error } = Joi.validate(newCustomer, addCustomersValidator);
  if (error === null) {
    sqlConnection.query(
      'INSERT INTO customers(first_name,last_name,gender,dob,email,member_since) VALUES (?,?,?,?,?,?)',
      Object.values(newCustomer),
      (err, results) => {
        if (results.affectedRows === 0) {
          res.status(404);
          res.send('INSERT UNSUCCESSFUL!');
        } else {
          res.send(newCustomer);
        }
      }
    );
  } else {
    res.status(400);
    res.send('Validation Error! Check Input parameters');
  }
}

function singleCaptainsInformation(req, res, next) {
  sqlConnection.query('SELECT * from customers where id= ?', req.params.id, (err, result) => {
    if (result.length !== 0) {
      res.render('customers', { result });
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
    member_since: req.body.member_since
  };
  const { error } = Joi.validate(updatedInfo, addCustomersValidator);

  updatedInfo.dob = formatDate(updatedInfo.dob);
  const queryValues = Object.values(updatedInfo);
  queryValues[queryValues.length - 1] = req.params.id;
  if (error === null && queryValues.length === 6) {
    sqlConnection.query(
      'UPDATE customers SET first_name = ? , last_name = ?, gender = ?, dob = ?, email = ? WHERE id = ? ',
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
  sqlConnection.query('DELETE from customers where id= ?', req.params.id, (err, result) => {
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
