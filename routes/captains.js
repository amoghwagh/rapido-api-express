const express = require('express');
const captainController = require('../controllers/captainController');

const router = express.Router();

router.get('/', captainController.captainsInformation);
router.post('/', captainController.addCaptains);
router.get('/:id', captainController.singleCaptainsInformation);
router.put('/:id', captainController.updateCaptainsInformation);
router.delete('/:id', captainController.deleteCaptainsInformation);

module.exports = router;
