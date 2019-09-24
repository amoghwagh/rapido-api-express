const express = require('express');
const ridesController = require('../controllers/ridesController');

const router = express.Router();

router.get('/', ridesController.ridesInformation);
router.get('/:id', ridesController.singleRideInformation);

module.exports = router;
