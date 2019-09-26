const query = require('../config/promisifiedQuery');

async function showRidesQuery() {
  const result = await query('SELECT * FROM rides');
  return result;
}

async function singleRideInfoQuery(value) {
  const result = await query('SELECT * from rides where rid= ?', value);
  return result;
}

module.exports = {
  showRidesQuery,
  singleRideInfoQuery
};
