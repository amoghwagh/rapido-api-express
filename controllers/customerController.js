/* eslint-disable func-names */
// const customerModel = require('../models/customer');

const Handlebars = require('express-handlebars');
const sqlConnection = require('../config/connection');

function customersInformation(req, res) {
  sqlConnection.query('SELECT * FROM customers', function(err, result) {
    if (err) throw err;
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      //   Handlebars.registerHelper('formatDate', value => {
      //     const formatedMysqlString = new Date(
      //       new Date(new Date(new Date(value)).toISOString()).getTime() -
      //         new Date(value).getTimezoneOffset() * 60000
      //     )
      //       .toISOString()
      //       .slice(0, 19)
      //       .replace('T', ' ');
      //     return formatedMysqlString;
      //   });
      res.render('customers', { result });

      sqlConnection.end();
    }
  });
}

module.exports = {
  customersInformation
};
