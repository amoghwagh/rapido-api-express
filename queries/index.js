const query = require('../config/promisifiedQuery');

async function loginQuery(value) {
  const result = await query('SELECT password FROM users where user_name = ?', value);
  return result;
}

module.exports = loginQuery;
