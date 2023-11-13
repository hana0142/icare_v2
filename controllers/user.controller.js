const UserService = require('../services/user.service');
const func_link = require('../middlewares/kakaoLinkUnlink');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('qs');
const func_token = require('../middlewares/authToken');
const url = require('url');

exports.Login = {
    sendCode: async (req, res) => {
        const { session, query } = req;
        const { code } = query;
        let tokenResponse;

        try {
            // Authorization Server 부터 Access token 발급받기
            tokenResponse = await axios({
                method: "POST",
                url: 'https://kauth.kakao.com/oauth/token',
                headers: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: qs.stringify({
                    grant_type: "authorization_code",
                    client_id: process.env.KAKAO_ID,
                    client_secret: process.env.KAKAO_SECRET_KEY,
                    redirect_uri: process.env.KAKAO_REDIRECT,
                    code
                })
            });
            res.send(tokenResponse.data.access_token);
            // res.redirect('/kakao/token?token=' + tokenResponse.data.access_token);
            // return res.status(200).json({ 'token': tokenResponse.data.access_token });
        } catch (error) {
            console.log(error);
            return res.status(500).json('Internal Server Error Occured');
        }
    },

    getToken: async (req, res) => {
        const kakaoAccessToken = req.headers.token;

        //1. kakaoAccessToken으로 사용자 정보 요청하기
        const kakaoUserInfo = await func_link.Kakao.getUserInfo(kakaoAccessToken);
        if (kakaoUserInfo === -1) {
            return res.status(404).json('Do Not Found')
        }

        //2.linkedUserDB
        const authData = {
            ...kakaoUserInfo.data
        };
        const { session, query } = req;
        const email = await authData.kakao_account.email;

        try {
            const isCheckedLinkUser = await func_link.Kakao.linkUser(session, "kakao", authData);
        } catch (err) {
            logger.error('error', err);
            return res.status(400).json('Do Not Found User');
        }

        //3. isExistedUser
        try {
            let isExistedUser = await UserService.SelectExistedUser(email);

            //DB_Existed User
            if (isExistedUser === 1) {
                var userInfo = await UserService.SelectUserInfo(email);
                userInfo = userInfo[0];
                const user_id = userInfo.user_id;
                const access_token = await func_token.GenerateAccessToken(email);
                const refresh_token = await func_token.GenerateRefreshToken(email);
                const store_refresh_token = UserService.UpdateUser(user_id, refresh_token);

                if (store_refresh_token != -1) {
                    const redirect_url = 'http://43.200.157.0:4000/user/main?access_token=' + access_token + '&user_id=' + user_id
                    res.redirect(redirect_url);
                }
                else {
                    return res.status(500).json('fail');
                }
            }
            else {
                const user_id = authData.id;
                const email = authData.kakao_account.email;
                const provider = 'kakao';
                const refreshToken = func_token.GenerateRefreshToken(email);
                const InsertUser = await UserService.InsertUser(user_id, email, provider, refreshToken);

                if (InsertUser != -1) {
                    res.redirect('/user/main?access_token=' + access_token + '?user_id' + user_id);
                    // return res.status(200).json({ 'user_id': user_id });
                    // return res.status(200).json({
                    //     'access_token': access_token,
                    //     'user_id': user_id
                    // });
                }
                else {
                    return res.status(500).json('fail');
                }

            }
        } catch (err) {
            logger.error('error', err);
            return res.status(400).json('Bad Request');
        }
    }
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


exports.kakao = {

}

exports.auth = {
    check_token: async (req, res, next) => {
        console.log('check_token', req.headers.access_token);
        const access_token = req.headers.access_token;
        const decode_token = jwt.decode(access_token);
        console.log('decode', decode_token);
        const email = decode_token.email;
        console.log('check_mail', email);


        if (req.headers.access_token) {
            const accessToken = req.headers.access_token;

            //1. access token verified
            const verified_at = await func_token.VerifyAccessToken(accessToken);

            if (verified_at) {

                var userInfo = await UserService.SelectUserInfo(email);
                userInfo = userInfo[0];
                console.log(userInfo);
                const user_id = userInfo.user_id;
                const new_access_token = await func_token.GenerateAccessToken(email);
                const new_refresh_token = await func_token.GenerateRefreshToken(email);
                const updateToken = await UserService.UpdateUser(user_id, new_refresh_token);

                console.log('new_access_token');
                console.log('user_id');

                if (updateToken != -1) {
                    res.cookie('user_id', user_id);
                    req.cookies.user_id = user_id;

                    res.cookie('access_token', new_access_token);
                    req.cookies.access_token = new_access_token;

                    res.cookie('email', email);
                    req.cookies.email = email;
                    next();
                }
                else {
                    return res.status(400).json('fail');
                }
            }

            //2. access token : expired && refresh token : verified
            else {
                const re_access_token = await func_token.GenerateAccessToken(email);
                const re_refresh_token = await func_token.GenerateRefreshToken(email);
                const verify_refresh_token = await func_token.VerifyRefreshToken(re_refresh_token);

                try {
                    if (verify_refresh_token) {
                        const re_access_token = await func_token.GenerateAccessToken(email);
                        res.cookie('user_id', user_id);
                        res.cookie('access_token', re_access_token);
                        next();
                    }

                    //3. access token : expired && refresh token : expired
                    else {
                        return res.status(400).json('expired token');
                    }
                } catch (err) {
                    console.log(err);
                    return res.status(500).json('fail');
                }
            }



            // if (verify_token) {
            //     // req.user = userInfo[0];
            //     const jwt_token = func_token.generate_token(email);
            //     // console.log(req.user);
            //     const updateToken = await UserService.UpdateUser(user_id, jwt_token);

            //     if (updateToken != -1) {
            //         // req.user = user;
            //         res.cookie('user', userInfo[0]);
            //         return res.status(200).json('success');
            //     }
            // }


        }


    }
}




// postUser: async (req, res) => {
//     const { accessToken } = req.body;
//     let kakaoProfile;

//     try {
//         console.log(accessToken);
//         kakaoProfile = await axios.get('https://kapi.kakao.com/v2/user/me', {
//             headers: {
//                 Authorization: 'Bearer' + accessToken,
//                 'Content-Type': 'application/json'
//             }
//         });
//         console.log(kakaoProfile);
//     } catch (err) {
//         return res.send('accesstoken error');
//     }
// },

// getKakaoToken: async (req, res) => {
//     let ACCESSTOKEN;
//     try {
//         const url = 'https://kauth.kakao.com/oauth/token';
//         const body = qs.stringify({
//             grant_type: 'authorization_code',
//             code: req.query.code
//         });

//         const header = { 'content-type': 'application/x-www-form-urlencoded' };
//         const response = await axios.post(url, body, header);
//         ACCESSTOKEN = response.data.access_token;
//         res.send('susccess');
//     } catch (e) {
//         console.log(e.message);
//         res.send('error');
//     }


//     try {
//         const url = 'https://kapi.kakao.com/v2/user/me';
//         const header = {
//             headers: {
//                 Authorization: `Beared ${ACCESSTOKEN}`
//             }
//         };

//         const response = await axios.get(url, header);
//         console.log(response.data.properties);
//         const payload = { nickname };
//         const access_token = makeJwt(payload);
//         console.log(access_token);
//         res.cookie('userToken', access_token).redirect('/');
//     } catch (err) {
//         console.log(err);

//     }

//     // const header = require
//     // if (req.query.code) {
//     //     const code = req.query.code
//     //     let options = {
//     //         url: 'https://kauth.kakao.com/oauth/token',
//     //         method: 'post',
//     //         headers: {
//     //             "Content-Type": "application/x-www-form-urlencoded"
//     //         },
//     //         data: qs.stringify({
//     //             grant_type: 'authorization_code',
//     //             client_id: process.env.KAKAO_ID,
//     //             redirect_uri: process.env.KAKAO_REDIRECT,
//     //             code: code
//     //         })
//     //     }
//     //     let isLinkedUserDB = 'fail'
//     //     axios(options)
//     //         .then(function (response) {
//     //             if (response.status === 200) {
//     //                 const token = response.data.access_token
//     //                 console.log(`token : ${token}`)
//     //                 isLinkedUserDB = 'success'
//     //                 return true
//     //             }
//     //         }).catch(function (err) {
//     //             console.log(`main getCode err : ${err}`)
//     //             isLinkedUserDB = 'failed'
//     //             return false
//     //         })
//     //         .then(function () {
//     //             const url = `${redirect}result/${result}`
//     //             res.redirect(url)
//     //         })
//     // } else {
//     //     res.status(200).json({ 'msg': `ICE ALERT MAIN PAGE` })
//     // }
// },
// returnCodeAPI: async (req, res) => {
//     try {
//         url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_ID}&redirect_uri=${process.env.KAKAO_REDIRECT}`
//         console.log(req.query.code);
//         res.redirect(url)
//     } catch (e) {
//         console.log(e)
//     }
// },

// getResult: async (req, res) => {
//     try {
//         console.log(req.params.result)
//         if (req.params.result === 'success') {
//             res.status(200).json({ 'msg': `등록이 완료되었습니다` })
//         } else {
//             res.status(200).json({ 'msg': `등록에 실패했습니다` })
//         }
//     } catch (e) {
//         console.log(e)
//     }

// },

// kakaoRecall: async (req, res) => {
//     const { session, query } = req;
//     const { code } = query;
//     console.log(query);
//     console.info("==== session ====");
//     const url = `https://kauth.kakao.com/oauth/token`;

//     let tokenResponse;

//     try {
//         tokenResponse = await axios({
//             method: "POST",
//             url,
//             headers: {
//                 "content-type": "application/x-www-form-urlencoded"
//             },
//             data: qs.stringify({
//                 grant_type: "authorization_code",
//                 client_id: process.env.KAKAO_ID,
//                 client_secret: process.env.KAKAO_SECRET_KEY,
//                 redirect_uri: process.env.KAKAO_REDIRECT,
//                 code
//             })
//         });
//     } catch (error) {
//         return res.json(error.data);
//     }

//     console.info("==== tokenResponse.data ====");
//     console.log(tokenResponse.data);

//     const { access_token } = tokenResponse.data;

//     // let userResponse;

//     // try {
//     //     userResponse = await axios({
//     //         method: "GET",
//     //         url: "https://kapi.kakao.com/v2/user/me",
//     //         headers: {
//     //             Authorization: `Bearer ${access_token}`
//     //         }
//     //     });
//     // } catch (error) {
//     //     return res.json(error.data);
//     // }

//     // console.info("==== userResponse.data ====");
//     // console.log(userResponse.data);

//     // const authData = {
//     //     ...tokenResponse.data,
//     //     ...userResponse.data
//     // };

//     // const result = linkUser(session, "kakao", authData);

//     // if (isLinkedUserDB) {
//     //     console.info("계정에 연결되었습니다.");
//     // } else {
//     //     console.warn("이미 연결된 계정입니다.");
//     // }

//     res.redirect("/");
// }


/*kakao
// linkAccount: async (req, res) => {


    //     const { access_token } = tokenResponse.data;

    //     let userResponse;
    //     try {
    //         // access_token 으로 사용자 정보 요청하기
    //         userResponse = await axios({
    //             method: "GET",
    //             url: "https://kapi.kakao.com/v2/user/me",
    //             headers: {
    //                 Authorization: `Bearer ${access_token}`
    //             }
    //         });

    //     } catch (error) {
    //         return res.json(error.data);
    //     }

    //     console.info("==== userResponse.data ====");
    //     console.log(userResponse.data);

    //     const authData = {
    //         ...tokenResponse.data,
    //         ...userResponse.data
    //     };

    //     const isLinkedUserDB = func_link.kakao.linkUser(session, "kakao", authData);
    //     // console.log(reseult)
    //     if (isLinkedUserDB) {
    //         console.log('*********************************************', isLinkedUserDB);
    //         // res.
    //         // res.cookie('user_id', authData.id);
    //         const email = userResponse.data.kakao_account.email;
    //         const check_user = await UserService.SelectUserInfo(email);

    //         if (check_user == 0) {
    //             res.redirect('/user')
    //         }
    //         else {
    //             res.redirect('/user/register')
    //         }

    //         // res.redirect('/user/?email=' + email);
    //         // req.session.loginData = userResponse.data;
    //         console.info("계정에 연결되었습니다.");

    //         // return req.session.save(() => {
    //         //     res.send({ loggedIn: true, loginDate: authData });
    //         //     // res.redirect('/');
    //         // });

    //     } else {
    //         console.warn("이미 연결된 계정입니다.");
    //         // res.redirect('/user/check/?email=' + email);

    //     }

    // },

    // unlinkAccount: async (req, res) => {
    //     const { session } = req;

    //     const { access_token } = session.authData.kakao;

    //     let unlinkResponse;
    //     try {
    //         unlinkResponse = await axios({
    //             method: "POST",
    //             url: "https://kapi.kakao.com/v1/user/unlink",
    //             headers: {
    //                 Authorization: `Bearer ${access_token}`
    //             }
    //         });
    //     } catch (error) {
    //         return res.json(error.data);
    //     }

    //     console.log("==== unlinkResponse.data ====");
    //     console.log(unlinkResponse.data);

    //     const { id } = unlinkResponse.data;
    //     const result = func_link.kakao.unlinkUser(session, "kakao", id);

    //     if (result) {
    //         console.log("연결 해제되었습니다.");
    //     } else {
    //         console.log("카카오와 연동된 계정이 아닙니다.");
    //     }
    //     res.redirect("/");
    // },
*/