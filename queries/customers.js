const query = require('../config/promisifiedQuery');

async function showCustomersQuery() {
  const result = await query('SELECT * FROM customers');
  return result;
}

async function addCustomerQuery(values) {
  const result = await query(
    'INSERT INTO customers(first_name,last_name,gender,dob,email,member_since) VALUES (?,?,?,?,?,?)',
    values
  );
  return result;
}

async function singleCustomerInfoQuery(values) {
  const result = await query('SELECT * from customers where id= ?', values);
  return result;
}

async function updateCustomerQuery(values) {
  const result = await query(
    'UPDATE customers SET first_name = ? , last_name = ?, gender = ?, dob = ?, email = ? WHERE id = ? ',
    values
  );
  return result;
}

async function deleteCustomerInfoQuery(value) {
  const result = await query('DELETE from customers where id= ?', value);
  return result;
}

module.exports = {
  showCustomersQuery,
  addCustomerQuery,
  singleCustomerInfoQuery,
  updateCustomerQuery,
  deleteCustomerInfoQuery
};
