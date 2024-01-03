/**
 * version  : 0.1
 * filename : user.controller.js
 * author   : @Hana
 * comment  : 사용자 관련 컨트롤러 기능 구현(라우터에 연결)
 */

const qs = require('qs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const logger = require('../config/logger');
const KakaoLink = require('../middlewares/kakaoLinkUnlink');
const UserService = require('../services/user.service');
const AuthorizeToken = require('../middlewares/authToken');
const { sequelize } = require('../models');

exports.Login = {
    kakaoLogin: (req, res) => {
        const BASE_URL = "https://kauth.kakao.com/oauth/authorize";
        const config = {
            client_id: process.env.KAKAO_ID,
            redirect_uri: process.env.KAKAO_REDIRECT,
            response_type: "code",
        };
        const config_url = new URLSearchParams(config).toString();
        const final_url = `${BASE_URL}?${config_url}`;

        return res.redirect(final_url);
    },

    kakaoCallback: async (req, res) => {
        const {
            data: { access_token: kakaoAccessToken },
        } = await axios('https://kauth.kakao.com/oauth/token', {
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_ID,
                redirect_uri: process.env.KAKAO_REDIRECT,
                code: req.query.code,
                client_secret: process.env.KAKAO_SECRET_KEY,
            },
        });

        //카카오에서 가져온 사용자 정보 불러오기
        const { data: userResponse } = await axios('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`,
            },
        });

        const authData = {
            ...userResponse
        };
        const { session, query } = req;
        const isLinkedKakao = await KakaoLink.Kakao.linkUser(session, "kakao", authData);
        // console.log('before', req.sessionID);

        //서버 DB 사용자 정보 확인
        if (isLinkedKakao) {
            const email = await authData.kakao_account.email;
            const isCheckedUser = await UserService.SelectExistedUser(email);
            // console.log('linkkakao', req.sessionID);

            //1. 가입된 사용자
            if (isCheckedUser === 1) {
                try {
                    var userInfo = await UserService.SelectUserInfo(email);
                    userInfo = userInfo[0];
                    const token = userInfo.token;
                    const user_id = userInfo.user_id;


                    const accessToken = await AuthorizeToken.GenerateAccessToken(email);
                    const refreshToken = await AuthorizeToken.GenerateRefreshToken(email);
                    const storeRefreshToken = await UserService.UpdateUser(user_id, refreshToken);

                    //리프레시 토큰 업데이트
                    if (storeRefreshToken === 1) {
                        // console.log(req.cookies.SID);
                        // console.log(req.headers.cookie.split('='));
                        // console.log(req.sessionID);
                        // console.log(req);
                        // console.log(req.headers.cookie.SID);
                        // res.cookies.sid = req.sessionID;

                        req.session.isLoggedIn = true;
                        req.session.user_id = user_id;
                        req.session.save();
                        const sessionId = req.sessionID;
                        // console.log('refreshtoken', req.sessionID);
                        // console.log('1', req);
                        // console.log('1', res);
                        // // req.ses
                        // res.setHeader('Set-Cookie', `sid=${req.ressionID}`)
                        // res.cookie('sid', req.ressionID);
                        // req.session.save()
                        // res.cookie('sid', req.sessionID, {
                        //     maxAge: 10000
                        // // });
                        // console.log(req.cookies);
                        // console.log(req.session);
                        // console.log(req.sessionID);
                        logger.info('GET_KAKAO_TOKEN : DB UPDATE REFRESH TOKEN');

                        return res.status(200).json({
                            'user_info': {
                                'user_id': user_id,
                                'email': email,
                                'access_token': accessToken,
                                'session_id': sessionId,
                            }
                        });

                    }

                    //토큰 업데이트 실패
                    else if (storeRefreshToken === 0) {
                        logger.error('GET_KAKAO_TOKEN : Not modified');
                        return res.status(305).send('GET_KAKAO_TOKEN : Not modified');
                    } else {
                        logger.error('GET_KAKAO_TOKEN : Bad Request');
                        return res.status(400).send('GET_KAKAO_TOKEN : Bad Request');
                    }
                } catch (err) {
                    logger.error('GET_KAKAO_TOKEN : ', err);
                    return res.status(500).send('GET_KAKAO_TOKEN : Internal Server Error occured');
                }
            }

            //2. 미가입자(DB에 없는 사용자)
            else {
                try {
                    const user_id = authData.id;
                    const email = authData.kakao_account.email;

                    const access_token = await AuthorizeToken.GenerateAccessToken(email);
                    const refresh_token = await AuthorizeToken.GenerateRefreshToken(email);
                    const insertUser = await UserService.InsertUser(user_id, email, refresh_token);

                    if (insertUser === 1) {
                        logger.info('INSERT USER');
                        // req.session.isLoggedIn = true;
                        // req.session.user_id = user_id;
                        // req.session.save();
                        // console.log(req.sessionID);
                        return res.status(201).json({
                            'user_info': {
                                'user_id': user_id,
                                'email': email,
                                'access_token': access_token
                            }
                        });
                    } else {
                        logger.error('insert user fail');
                        return res.status(400).send('Bad Request');
                    }
                } catch (err) {
                    logger.error(err);
                    return res.status(500).send('Internal Server Error occured');
                }
            }
        } else {
            logger.error(JSON.stringify(req.session.authData));
            return res.status(409).json('이미 연결된 계정입니다,');
        }
    },

    deleteUser: async (req, res) => {
        const user_id = req.params.user_id;
        let dbDeleteResult;

        try {
            dbDeleteResult = await UserService.DeleteUser(user_id);

            if (dbDeleteResult === 1) {
                if (req.session) {
                    req.session.destroy();
                    return res.status(200).json('success');
                }
                else
                    return res.status(200).json('success');

            } else if (dbDeleteResult === 0) {

                return res.status(400).json('fail db delete')
            } else {

                return res.status(400).json('fail db delete')
            }
        } catch (error) {
            return res.status(500).json('fail');
        }
    },

    deleteUserInDB: async (req, res) => {
        const user_id = req.params.user_id;
        const access_token = req.header.access_token;
        let dbDeleteResult;

        try {
            dbDeleteResult = await UserService.DeleteUser(user_id);

            if (dbDeleteResult === 1) {
                if (req.session) {
                    req.session.destroy();
                    return res.status(200).json('success');
                }
                else
                    return res.status(200).json('success');
                // return res.status(200).json('success');

            } else if (dbDeleteResult === 0) {
                return res.status(400).json('fail db delete')
            } else {
                return res.status(400).json('fail')
            }
            // res.redirect("/kakao");
        } catch (error) {
            return res.status(500).json('fail');
        }
    },

    deleteSession: async (req, res) => {
        try {
            // logger.info(JSON.stringify(req.session.isLoggedIn));
            // const user_id = await req.cookies.sid;
            // console.log('deletesessionID', req.sessionID);
            // res.setHeader('Set-Cookie', 'login=podo; Max-Age=0;')
            // console.log('delete_session_header', req.headers);
            // console.log('deletesessioncookieID', req.cookies.sid);
            // console.log('refreshtoken', req.sessionID);
            // console.log('2', req);
            // console.log('1', res);
            // const select_data_query = `select * from session where sid = '${req.sessionID}'`
            // const select_data_query = `select * from session where sid = '${req.sessionID}'`
            const user_id = req.params.user_id;
            const select_data_query = `select * from session where sess ->> 'user_id' = '` + user_id + `';`;
            // // "DELETE FROM vehiculo WHERE vehiculo_id= $1", [id],
            sequelize.query(
                select_data_query).then((result) => {
                    console.log(result);
                    // 세션이 존재하지 않을 경우
                    if (result[0].length === 0) {
                        logger.error('no session');
                        return res.status(404).json('no session');
                    }
                    // 세션이 존재할 경우
                    else {
                        logger.info(JSON.stringify(req.session.user_id));
                        console.log('logout', result);
                        // if (result.sid = sessionID) {
                        req.session.destroy(function (err) {
                            if (err) {
                                return next(err);
                            } else {
                                req.session = null;
                                res.clearCookie('connect.sid');
                                res.clearCookie('user_id')
                                logger.info('success');
                                req.session = null;
                                return res.status(200).json('success');
                            }
                        });
                        // req.session.destroy((err) => {
                        //     res.clearCookie('connect.sid');
                        //     res.clearCookie('user_id')
                        //     if (err) {
                        //         logger.error('fail: session destory');
                        //         return res.status(400).json('fail');
                        //     } else {
                        //         logger.info('success');
                        //         req.session = null;
                        //         return res.redirect('/kakao/login');
                        //     }
                        // })
                        // } else {
                        //     logger.error('user_id is different');
                        //     return res.status(400).json('user_id is different');
                        // }
                    }
                })
        } catch (err) {
            logger.error('INTERNAL SERVER ERROR', err);
            return res.status(500).json('internal error');
        }
    }
}

exports.Auth = {
    checkJsonWebToken: async (req, res, next) => {
        if (req.headers.access_token) {
            const accessToken = req.headers.access_token;
            logger.info({ headers: req.headers });

            try {
                //1. access token verified
                const isVerifedAccessToken = await AuthorizeToken.VerifyAccessToken(accessToken);
                logger.info('no access_token  :', isVerifedAccessToken.ok);

                if (isVerifedAccessToken.ok) {
                    const decode_token = jwt.decode(accessToken);
                    const email = decode_token.email;
                    var userInfo = await UserService.SelectUserInfo(email);
                    userInfo = userInfo[0];
                    const user_id = userInfo.user_id;
                    const new_refresh_token = await AuthorizeToken.GenerateRefreshToken(email);
                    const updateToken = await UserService.UpdateUser(user_id, new_refresh_token);

                    if (updateToken != -1) {
                        // console.log(req.cookies.SID);
                        req.session.isLoggedIn = true;

                        // req.session.user_id = user_id;
                        req.session.save();
                        console.log('tokensave', req.sessionID);
                        next();
                    } else {
                        logger.error('DB MODIFTIED FAIL')
                        return res.status(403).json('DB MODIFTIED FAIL');
                    }
                }

                //2. access token : expired && refresh token : verified
                else if (isVerifedAccessToken.err === -1) {
                    return res.status(401).json('Unauthorization');
                }
                else if (isVerifedAccessToken.err === -2) {
                    return res.status(400).json('invalid token');
                } else {
                    if (req.session.isLoggedIn) {
                        const user_id = req.session.user_id;
                        const userInfo = await UserService.SelectUserInfoUserId(user_id);
                        const refreshToken = userInfo[0].token;
                        const verify_refresh_token = await AuthorizeToken.VerifyRefreshToken(refreshToken);

                        try {
                            if (verify_refresh_token.ok) {
                                const decode_token = jwt.decode(refreshToken);
                                const email = decode_token.email;
                                const re_access_token = await AuthorizeToken.GenerateAccessToken(email);
                                res.json({ 'new access token': re_access_token });
                            }

                            //3. access token : expired && refresh token : expired
                            else {
                                res.status(400).json('expired token');
                            }
                        } catch (err) {
                            // console.log(err);
                            logger.error(err);
                            res.status(500).json('fail');
                        }
                    }
                }
            } catch (err) {
                // console.log(err);
                logger.error(err);
                return res.status(500).json('fail');
            }
        } else {
            return res.status(404).json('No Found Parameter Access Token');
        }
    },
    testcheckJsonWebToken: async (req, res) => {
        if (req.headers.access_token) {
            const accessToken = req.headers.access_token;
            console.log('testtoken', req.sessionID);
            //1. access token verified
            try {
                const isVerifedAccessToken = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET);

                if (!isVerifedAccessToken) {
                    logger.err('accesstoken invalid', isVerifedAccessToken);
                    return res.status(401).send('Unauthorized request');
                }

                // await AuthorizeToken.VerifyAccessToken(accessToken);
                // const verified_rt = await AuthorizeToken.VerifyAccessToken(accessToken);
                if (isVerifedAccessToken) {
                    const decode_token = jwt.decode(accessToken);
                    const email = decode_token.email;
                    var userInfo = await UserService.SelectUserInfo(email);
                    userInfo = userInfo[0];
                    // console.log(userInfo);
                    const user_id = userInfo.user_id;
                    const new_access_token = await AuthorizeToken.GenerateAccessToken(email);
                    const new_refresh_token = await AuthorizeToken.GenerateRefreshToken(email);
                    const updateToken = await UserService.UpdateUser(user_id, new_refresh_token);

                    // console.log('new_access_token');
                    // console.log('user_id');

                    if (updateToken != -1) {
                        console.log('testtoken2', req.sessionID);

                        // req.session.isLoggedIn = true;
                        // req.session.user_id = user_id;
                        // req.session.save();
                        // console.log(req);
                        return res.status(200).json('success');
                        // return res.status(200).json({ 'new_access_token': new_access_token });
                    }
                    else {
                        return res.status(401).json('invalid token');
                    }
                }

                //2. access token : expired && refresh token : verified
                else {
                    const user_id = req.params.user_id;
                    const userInfo = await UserService.SelectUserInfoUserId(user_id);
                    // console.log('userinfo', userInfo[0].token);
                    const refreshToken = userInfo[0].token;


                    try {
                        const verify_refresh_token = jwt.verify(refreshToken, JWT_TOKEN_SECRET);

                        if (verify_refresh_token) {
                            const decode_token = jwt.decode(refreshToken);
                            console.log('decode', decode_token);
                            const email = decode_token.email;
                            console.log('check_mail', email);
                            // var userInfo = await UserService.SelectUserInfo(email);
                            // userInfo = userInfo[0];
                            // console.log(userInfo);
                            const re_access_token = await AuthorizeToken.GenerateAccessToken(email);
                            return res.status(200).json('new access token', re_access_token);

                        }

                        //3. access token : expired && refresh token : expired
                        else {
                            logger.error('expired token')
                            return res.status(401).json('expired token');
                        }
                    } catch (err) {
                        console.log(err);
                        return res.status(500).json('fail');
                    }
                }
            } catch (err) {
                logger.error(err);
                return res.status(401).json('unauthorization')
            }
        }
    },

}



exports.Local = {
    checkUser: async (req, res) => {
        const email = req.params.email;
        const findUser = await UserService.SelectUserInfo(email);
        if (findUser != -1) {
            return res.stauts(200).json('success');
        }
        else {
            return res.status(400).json('fail');
        }
    },

    registerUser: async (req, res) => {
        const email = req.params.email;
        const signUpUser = await UserService.insertUser()
    },

    mainHome: async (req, res) => {
        console.log(req.query);
        if (req.query.user_id) {
            const user_id = req.query.user_id;
            const access_token = req.query.access_token;

            return res.status(200).json({
                'user_id': user_id,
                'access_token': access_token
            })
        } else {
            return res.status(500).json('fail');
        }

    }
}

exports.Test = {
    testHome: async (req, res) => {
        try {
            console.log('test');
            return res.status(200);
        } catch (err) {
            console.log('fail');
            return res.status(400);
        }

    }
}