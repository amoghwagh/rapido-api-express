const query = require('../config/promisifiedQuery');

async function showCaptainsQuery() {
  const result = await query('SELECT * FROM captains');
  return result;
}

async function addCaptainsQuery(values) {
  const result = await query(
    'INSERT INTO captains(first_name,last_name,gender,dob,email,date_joined) VALUES (?,?,?,?,?,?)',
    values
  );
  return result;
}

async function singleCaptainInfoQuery(value) {
  const result = await query('SELECT * from captains where cid= ?', value);
  return result;
}

async function updateCaptainQuery(values) {
  const result = await query(
    'UPDATE captains SET first_name = ? , last_name = ?, gender = ?, dob = ?, email = ? WHERE cid = ? ',
    values
  );
  return result;
}

async function deleteCaptainInfoQuery(value) {
  const result = await query('DELETE from captains where cid= ?', value);
  return result;
}

module.exports = {
  showCaptainsQuery,
  addCaptainsQuery,
  singleCaptainInfoQuery,
  updateCaptainQuery,
  deleteCaptainInfoQuery
};
