const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const ResultController = require('../controllers/result.controller');

//vision_check
router.get('/vision/:user_id', UserController.auth.check_token, ResultController.VisionCheck.resultByUserId);
router.get('/vision/detail/:check_id', UserController.auth.check_token, ResultController.VisionCheck.resultByCheckId);
router.get('/vision/month/:user_id', UserController.auth.check_token, ResultController.VisionCheck.resultGroupByMonth);

//blind_spot_result
router.get('/blindspot/:user_id', UserController.auth.check_token, ResultController.BlindSpotCheck.resultByUserId);
router.get('/blindspot/detail/:check_bs_id', UserController.auth.check_token, ResultController.BlindSpotCheck.resultByCheckId);
router.get('/blindspot/:user_id/month', UserController.auth.check_token, ResultController.BlindSpotCheck.resultGroupByMonth);
router.get('/blindspot/:user_id/month/detail', ResultController.BlindSpotCheck.resultGroupByMonthDetail);

//eye_movement_result
router.get('/eyemovement/:user_id', ResultController.EyeMovementCheck.getResult);
router.get('/eyemovement/detail/:check_em_id', ResultController.EyeMovementCheck.getResultDetail);
router.get('/eyemovement/:user_id/month', ResultController.EyeMovementCheck.getResultMonth);
router.get('/eyemovement/:user_id/month/detail', ResultController.EyeMovementCheck.getResultMonthDetail);



// 로그아웃 라우터, /auth/logout
// router.get('/logout', isLoggedIn, (req, res) => {
// req.logout(); // req.user 객체를 제거함
// req.session.destroy(); // req.session 객체의 내용을 제거함 -  세션 정보를 지움
// res.redirect('/'); // 메인 페이지로 돌아감


// 카카오 로그인 라우터, /auth/kakao

// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/kakao/callback', passport.authenticate('kakao', {
//     failureRedirect: '/',
// }), (req, res) => {
//     res.redirect('/');
// });
module.exports = router;