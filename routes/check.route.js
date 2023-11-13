const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const CheckController = require('../controllers/check.controller');

router.get('/vision/:user_id', UserController.auth.check_token, CheckController.Vision.getCheck);
router.post('/vision/:user_id', UserController.auth.check_token, CheckController.Vision.postCheck);

router.get('/blindspot/:user_id', UserController.auth.check_token, CheckController.BlindSpot.getCheck);
router.post('/blindspot/:user_id', UserController.auth.check_token, CheckController.BlindSpot.postCheck);

router.get('/eyemovement/:user_id', UserController.auth.check_token, CheckController.EyeMovement.getCheck);
router.post('/eyemovement/:user_id', UserController.auth.check_token, CheckController.EyeMovement.postCheck);

module.exports = router;