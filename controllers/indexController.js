const Joi = require('joi');
const sqlConnection = require('../config/connection');

function showMainPage(req, res) {
  res.render('index', { title: 'Rapido' });
}

function validateLogin(req, res) {}

module.exports = {
  showMainPage,
  validateLogin
};
