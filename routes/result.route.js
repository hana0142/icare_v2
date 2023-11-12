const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/result.controller');
const UserController = require('../controllers/user.controller');

router.get('/vision/:user_id', ResultController.VisionCheck.resultByUserId);
router.get('/vision/detail/:check_id', ResultController.VisionCheck.resultByCheckId);
router.get('/vision/month/:user_id', ResultController.VisionCheck.resultGroupByMonth);

router.get('/blindspot/:user_id', ResultController.BlindSpotCheck.resultByUserId);
router.get('/blindspot/detail/:check_bs_id', ResultController.BlindSpotCheck.resultByCheckId);
router.get('/blindspot/:user_id/month', ResultController.BlindSpotCheck.resultGroupByMonth);
router.get('/blindspot/:user_id/month/detail', ResultController.BlindSpotCheck.resultGroupByMonthDetail);


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