const express = require('express');
const captainController = require('../controllers/captainController');

const verifyToken = require('../authenticator/verifyJwtMiddleware');

const router = express.Router();

router.get('/', captainController.captainsInformation);
router.post('/', verifyToken, captainController.addCaptains);
router.get('/:id', captainController.singleCaptainsInformation);
router.put('/:id', verifyToken, captainController.updateCaptainsInformation);
router.delete('/:id', verifyToken, captainController.deleteCaptainsInformation);

module.exports = router;
