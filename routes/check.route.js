const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const CheckController = require('../controllers/check.controller');

router.post('/vision/:user_id', UserController.Auth.checkJsonWebToken, CheckController.VisionCheck.postCheckResult);

router.get('/blindspot/:user_id', UserController.Auth.checkJsonWebToken, CheckController.BlindSpotCheck.getCheckId);
router.post('/blindspot/:user_id', UserController.Auth.checkJsonWebToken, CheckController.BlindSpotCheck.postCheckResult);

router.get('/eyemovement/:user_id', UserController.Auth.checkJsonWebToken, CheckController.EyeMovementCheck.getCheckId);
router.post('/eyemovement/:user_id', UserController.Auth.checkJsonWebToken, CheckController.EyeMovementCheck.postCheckResult);

module.exports = router;