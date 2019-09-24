const bcrypt = require('bcrypt');
const sqlConnection = require('../config/connection');

function register(req, res) {
  const user = {
    user_name: req.body.uname,
    password: req.body.passwd,
    email: req.body.email
  };
  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync(user.password, salt);
  user.password = hashedPass;

  sqlConnection.query(
    'INSERT INTO users(user_name,password,email) VALUES (?,?,?)',
    Object.values(user),
    (err, results) => {
      if (results.affectedRows === 0) {
        res.status(404);
        alert('REGISTER UNSUCCESSFUL!!');
      } else {
        alert('REGISTERED SUCCESSFULLY!!');
      }
    }
  );
}

module.exports = {
  register
};
