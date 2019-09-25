/* eslint-disable func-names */
const express = require('express');
const registerController = require('../controllers/registerController');

const router = express.Router();

/* GET Register page. */
router.get('/', registerController.renderPage)

router.post('/', registerController.register);

module.exports = router;
