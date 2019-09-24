const express = require('express');
const registerController = require('../controllers/registerController');

const router = express.Router();

/* GET Register page. */
router.get('/', function(req, res) {
  res.render('register');
});

router.post('/', registerController.register);

module.exports = router;
