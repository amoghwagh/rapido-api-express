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

const addCustomersValidator = Joi.object({
  first_name: Joi.string()
    .alphanum()
    .required(),
  last_name: Joi.string()
    .alphanum()
    .required(),
  gender: Joi.string().required(),
  dob: Joi.number().integer(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  member_since: Joi.required()
});

function customersInformation(req, res) {
  sqlConnection.query('SELECT * FROM customers', function(err, result) {
    if (err) throw err;
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('customers', { result });

      sqlConnection.end();
    }
  });
}

function addCustomers(req, res) {
  const newCustomer = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    dob: req.body.dob,
    email: req.body.email
  };
  newCustomer.dob = formatDate(newCustomer.dob);
  newCustomer.member_since = currentDateTime();
  if (Joi.validate(newCustomer, addCustomersValidator)) {
    sqlConnection.query(
      'INSERT INTO customers(first_name,last_name,gender,dob,email,member_since) VALUES (?,?,?,?,?,?)',
      Object.values(newCustomer),
      err => {
        if (err) throw err;
        res.send(newCustomer);
      }
    );
    sqlConnection.end();
  } else {
    res.status(400);
    res.send('Query Not Executed');
  }
}

function singleCustomerInformation(req, res) {
  sqlConnection.query('SELECT * from customers where id= ?', req.params.id, (err, result) => {
    if (err) throw err;
    if (Object.keys(result).length > 0) {
      res.render('customers', { result });
    } else {
      res.status(404);
      res.send('ID Not Found');
    }
  });
}

module.exports = {
  customersInformation,
  addCustomers,
  singleCustomerInformation
};
