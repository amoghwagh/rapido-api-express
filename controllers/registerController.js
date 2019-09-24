function register(req, res) {
  const user = {
    user_name: req.body.uname,
    password: req.body.passwd,
    email: req.body.email
  };
  console.log(user);
}

module.exports = {
  register
};
