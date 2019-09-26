const createError = require('http-errors');
const ridesQuery = require('../queries/rides');

const { showRidesQuery } = ridesQuery;
const { singleRideInfoQuery } = ridesQuery;

async function ridesInformation(req, res, next) {
  try {
    const result = await showRidesQuery();
    if (req.headers['content-type'] === 'application/json') {
      res.send(result);
    } else {
      res.render('rides', { result });
    }
  } catch (err) {
    next(err);
  }
}
async function singleRideInformation(req, res, next) {
  try {
    const result = await singleRideInfoQuery(req.params.id);
    if (result.length !== 0) {
      res.render('rides', { result });
    } else {
      next(createError(404, 'ID Not Found'));
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  ridesInformation,
  singleRideInformation
};
