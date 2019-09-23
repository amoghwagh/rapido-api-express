const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

/* GET users listing. */
router.get('/', customerController.customersInformation);

module.exports = router;
