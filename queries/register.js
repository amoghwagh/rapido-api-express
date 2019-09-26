const query = require('../config/promisifiedQuery');

async function registerQuery(values) {
  const result = await query('INSERT INTO users(user_name,password,email) VALUES (?,?,?)', values);
  return result;
}

module.exports = registerQuery;
