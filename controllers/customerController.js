/* eslint-disable func-names */
// const customerModel = require('../models/customer');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const formatDate = require('../utils/formatDate');
const currentDateTime = require('../utils/currentDateTime');

const addCustomersValidator = require('../validations/customers');

const customerQueries = require('../queries/customers');

const { showCustomersQuery } = customerQueries;
const { addCustomerQuery } = customerQueries;
const { updateCustomerQuery } = customerQueries;
const { singleCustomerInfoQuery } = customerQueries;
const { deleteCustomerInfoQuery } = customerQueries;

async function customersInformation(req, res, next) {
  try {
    const result = await showCustomersQuery();
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('customersForm', { result });
    }
  } catch (err) {
    next(err);
  }
}

async function addCustomers(req, res, next) {
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
  if (error === null) {
    try {
      const results = await addCustomerQuery(Object.values(newCustomer));
      if (results.affectedRows === 0) {
        next(createError(404, 'INSERT UNSUCCESSFUL!'));
      } else {
        res.send(newCustomer);
      }
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(400, 'Validation Error! Check Input parameters'));
  }
}

async function singleCustomerInformation(req, res, next) {
  try {
    const result = await singleCustomerInfoQuery(req.params.id);
    if (result.length !== 0) {
      res.render('customers', { result });
    } else {
      next(createError(404, 'ID Not Found'));
    }
  } catch (err) {
    next(err);
  }
}

async function updateCustomerInformation(req, res, next) {
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
    try {
      const result = await updateCustomerQuery(queryValues);
      if (result.affectedRows === 0) {
        next(createError(404, 'Update Unsuccessful! Check the input'));
      } else {
        res.send(updatedInfo);
      }
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(400, 'Validation Error! Check Input parameters'));
  }
}

async function deleteCustomerInformation(req, res, next) {
  try {
    const result = await deleteCustomerInfoQuery(req.params.id);
    if (result.affectedRows === 0) {
      res.status(404);
      res.send('DELETE UNSUCCESSFUL!');
    } else {
      res.send('DELETE SUCCESSFUL!');
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  customersInformation,
  addCustomers,
  singleCustomerInformation,
  updateCustomerInformation,
  deleteCustomerInformation
};
