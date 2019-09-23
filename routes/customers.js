const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

/* GET users listing. */
router.get('/', customerController.customersInformation);
router.post('/', customerController.addCustomers);

module.exports = router;
