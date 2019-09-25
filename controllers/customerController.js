/* eslint-disable func-names */
// const customerModel = require('../models/customer');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const sqlConnection = require('../config/connection');
const formatDate = require('../utils/formatDate');
const currentDateTime = require('../utils/currentDateTime');

const addCustomersValidator = Joi.object({
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

function customersInformation(req, res, next) {
  sqlConnection.query('SELECT * FROM customers', function(err, result) {
    if (err) next(err);
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('customers', { result });
    }
  });
}

function addCustomers(req, res) {
  try {
    jwt.verify(req.cookies.jwt, 'NotASecretAnymore');
    const newCustomer = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      dob: req.body.dob,
      email: req.body.email
    };
    // newCustomer.dob = formatDate(newCustomer.dob);
    newCustomer.member_since = currentDateTime();
    const { error } = Joi.validate(newCustomer, addCustomersValidator);
    console.log(error);
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
  } catch (err) {
    res.status(403).send('You are not Authorized to access');
  }
}

function singleCustomerInformation(req, res) {
  sqlConnection.query('SELECT * from customers where id= ?', req.params.id, (err, result) => {
    if (result.length !== 0) {
      res.render('customers', { result });
    } else {
      res.status(404);
      res.send('ID Not Found');
    }
  });
}

function updateCustomerInformation(req, res) {
  try {
    jwt.verify(req.cookies.jwt, 'NotASecretAnymore');
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
  } catch (err) {
    res.status(403).send('You are not Authorized to access');
  }
}

function deleteCustomerInformation(req, res) {
  try {
    jwt.verify(req.cookies.jwt, 'NotASecretAnymore');
    sqlConnection.query('DELETE from customers where id= ?', req.params.id, (err, result) => {
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
  customersInformation,
  addCustomers,
  singleCustomerInformation,
  updateCustomerInformation,
  deleteCustomerInformation
};
