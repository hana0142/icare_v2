const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const CheckController = require('../controllers/check.controller');


// router.get('/start', UserController.auth.check_token, CheckController.Check.checkStart);
router.get('/vision/:user_id', UserController.auth.check_token, CheckController.Vision.getCheck);
router.post('/vision/:user_id', CheckController.Vision.postCheck);

router.get('/blindspot/:user_id', CheckController.BlindSpot.getCheck);
router.post('/blindspot/:user_id', CheckController.BlindSpot.postCheck);

router.get('/eyemovement/:user_id', CheckController.EyeMovement.getCheck);
router.post('/eyemovement/:user_id', CheckController.EyeMovement.postCheck);



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