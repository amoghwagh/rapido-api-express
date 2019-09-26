const sqlConnection = require('./connection');

function promisifiedQuery(query, values) {
  return new Promise((resolve, reject) => {
    sqlConnection.query(query, values, (err, result) => {
      if (err) reject(err);
      else {
        resolve(result);
      }
    });
  });
}

module.exports = promisifiedQuery;
