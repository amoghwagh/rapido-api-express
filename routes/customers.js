const express = require('express');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.get('/', customerController.customersInformation);
router.post('/', customerController.addCustomers);
router.get('/:id', customerController.singleCustomerInformation);
router.put('/:id', customerController.updateCustomerInformation);
router.delete('/:id', customerController.deleteCustomerInformation);

module.exports = router;
