const sqlConnection = require('../config/connection');

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

function singleRideInformation(req, res, next) {
  sqlConnection.query('SELECT * from rides where rid= ?', req.params.id, (err, result) => {
    if (result.length !== 0) {
      if (err) next(err);
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
