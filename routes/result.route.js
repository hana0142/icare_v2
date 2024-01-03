const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const ResultController = require('../controllers/result.controller');

//vision_check
router.get('/vision/:user_id', UserController.Auth.checkJsonWebToken, ResultController.VisionCheck.getResultByUserId);
router.get('/vision/detail/:check_id', UserController.Auth.checkJsonWebToken, ResultController.VisionCheck.getResultByCheckId);
router.get('/vision/month/:user_id', UserController.Auth.checkJsonWebToken, ResultController.VisionCheck.getResultGroupByMonth);

//blind_spot_result
router.get('/blindspot/:user_id', UserController.Auth.checkJsonWebToken, ResultController.BlindSpotCheck.getResultByUserId);
router.get('/blindspot/detail/:check_bs_id', UserController.Auth.checkJsonWebToken, ResultController.BlindSpotCheck.getResultByCheckId);
router.get('/blindspot/month/:user_id', UserController.Auth.checkJsonWebToken, ResultController.BlindSpotCheck.getResultGroupByMonth);
router.get('/blindspot/month/detail/:user_id', UserController.Auth.checkJsonWebToken, ResultController.BlindSpotCheck.getResultGroupByMonthDetail);

//eye_movement_result
router.get('/eyemovement/:user_id', UserController.Auth.checkJsonWebToken, ResultController.EyeMovementCheck.getResultByUserId);
router.get('/eyemovement/detail/:check_em_id', UserController.Auth.checkJsonWebToken, ResultController.EyeMovementCheck.getResultByCheckId);
router.get('/eyemovement/month/:user_id', UserController.Auth.checkJsonWebToken, ResultController.EyeMovementCheck.getResultGroupByMonth);
router.get('/eyemovement/month/detail/:user_id', UserController.Auth.checkJsonWebToken, ResultController.EyeMovementCheck.getResultGroupByMonthDetail);

router.get('/total/:user_id', ResultController.TotalResult.getTotalResultByUserId);

module.exports = router;