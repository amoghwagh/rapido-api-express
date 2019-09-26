const express = require('express');
const customerController = require('../controllers/customerController');

const verifyToken = require('../authenticator/verifyJwtMiddleware');

const router = express.Router();

router.get('/', customerController.customersInformation);
router.post('/', verifyToken, customerController.addCustomers);
router.get('/:id', customerController.singleCustomerInformation);
router.put('/:id', verifyToken, customerController.updateCustomerInformation);
router.delete('/:id', verifyToken, customerController.deleteCustomerInformation);

module.exports = router;
