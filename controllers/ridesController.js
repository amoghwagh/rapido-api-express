// const Joi = require('joi');
const sqlConnection = require('../config/connection');

// const ridesValidator = Joi.object({
//   rid: Joi.number().required(),
//   cid: Joi.number().required(),
//   source: Joi.string().required(),
//   dest: Joi.string().required(),
//   dist: Joi.string().required(),
//   fare: Joi.string().required()
// });

function ridesInformation(req, res, next) {
  sqlConnection.query('SELECT * FROM rides', (err, result) => {
    if (err) next(err);
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('rides', { result });
    }
  });
}

function singleRideInformation(req, res) {
  sqlConnection.query('SELECT * from rides where rid= ?', req.params.id, (err, result) => {
    if (result.length !== 0) {
      res.render('rides', { result });
    } else {
      res.status(404);
      res.send('ID Not Found');
    }
  });
}

module.exports = {
  ridesInformation,
  singleRideInformation
};
