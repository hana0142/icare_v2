const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// router.get('/kakao/send', UserController.Login.kakaoLogin);
router.get('/home', UserController.Test.testHome);
router.get('/kakao/login', UserController.Login.kakaoLogin);
router.get("/auth/kakao/callback", UserController.Login.kakaoCallback);
router.get('/user/check', UserController.Local.checkUser);
router.get('/user/logout/:user_id', UserController.Login.deleteSession);
router.get('/test/token/:user_id', UserController.Auth.testcheckJsonWebToken);
router.delete('/test/user/:user_id', UserController.Login.deleteUserInDB);
router.delete('/user/:user_id', UserController.Login.deleteUser);

module.exports = router;



