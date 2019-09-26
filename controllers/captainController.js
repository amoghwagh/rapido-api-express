/* eslint-disable func-names */
// const customerModel = require('../models/customer');

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const formatDate = require('../utils/formatDate');
const currentDateTime = require('../utils/currentDateTime');

const captainsValidator = require('../validations/captains.js');

const captainsQueries = require('../queries/captains');

const { showCaptainsQuery } = captainsQueries;
const { addCaptainsQuery } = captainsQueries;
const { updateCaptainQuery } = captainsQueries;
const { singleCaptainInfoQuery } = captainsQueries;
const { deleteCaptainInfoQuery } = captainsQueries;

async function captainsInformation(req, res, next) {
  try {
    const result = await showCaptainsQuery();
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('captains', { result });
    }
  } catch (err) {
    next(err);
  }
}

async function addCaptains(req, res, next) {
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
    try {
      const results = await addCaptainsQuery(Object.values(newCaptain));
      if (results.affectedRows === 0) {
        next(createError(404, 'INSERT UNSUCCESSFUL!'));
      } else {
        res.send(newCaptain);
      }
    } catch (err) {
      next(err);
    }
  } else {
    next(createError(400, 'Validation Error! Check Input parameters'));
  }
}

async function singleCaptainsInformation(req, res, next) {
  try {
    const result = await singleCaptainInfoQuery(req.params.id);
    if (result.length !== 0) {
      res.render('captains', { result });
    } else {
      next(createError(404, 'ID Not Found'));
    }
  } catch (err) {
    next(err);
  }
}

async function updateCaptainsInformation(req, res, next) {
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
    try {
      const result = await updateCaptainQuery(queryValues);
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

async function deleteCaptainsInformation(req, res, next) {
  try {
    const result = await deleteCaptainInfoQuery(req.params.id);
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
  captainsInformation,
  addCaptains,
  singleCaptainsInformation,
  updateCaptainsInformation,
  deleteCaptainsInformation
};
