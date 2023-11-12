const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const passport = require('passport');
const axios = require('axios');
const qs = require('qs');
// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/auth/kakao/callback',
//     passport.authenticate('kakao', {
//         failureRedirect: '/'
//     }), (req, res, next) => {
//         console.log(req.query);
//         res.redirect('/kakaotoken');
//     });
// router.post('/me', UserController.login.postUser);
// // router.get('/login', UserController.login.getCode);
// router.get('/kakaotoken', UserController.login.kakaoRecall);
// router.get('/kakao/code', UserController.login.returnCodeAPI);
// router.get('/result/:result', UserController.login.getResult);
// router.get('/kakao/token', UserController.login.getKakaoToken);
// rocess.env.KAKAO_ID,
// client_secret: process.env.KAKAO_SECRET_KEY,
// redirect_uri: process.env.KAKAO_REDIRECT

//kakao login
router.get("/kakao", (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_ID
        }&redirect_uri=${process.env.KAKAO_REDIRECT}&response_type=code`;

    return res.redirect(kakaoAuthUrl);
});

//kakao login call back_link account
router.get("/auth/kakao/callback", UserController.Login.sendCode);

// router.get("/unlink", UserController.kakao.unlinkAccount);
router.get('/kakao/token', UserController.Login.getToken);
router.get('/kakao/send', UserController.Login.sendCode);
router.get('/user/check', UserController.Local.checkUser);
// router.get('/user/main', UserController.local.mainHome);
router.get('/user/main', UserController.Local.mainHome);


// router.get('/user/')
// router.get('/user',UserController.)
module.exports = router;



