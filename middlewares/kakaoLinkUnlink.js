// const winston = require('winston');
const axios = require('axios');
const UserService = require('../services/user.service');
const logger = require('../config/logger');
exports.Kakao = {
    async unlinkUser(user_id, unlink_id) {
        let result = false;
        logger.info(user_id, unlink_id);
        if (user_id === unlink_id) {
            const deleteuser = await UserService.DeleteUser(user_id);
            console.log(deleteuser);
            result = true;
            return result;
        }
        return result;
    },


    async linkUser(session, provider, authData) {
        let result = false;
        console.log('session', session.authData);
        // console.log('*****authData', authData);
        if (session.authData) {
            console.log(session.authData[provider].id);
            if (session.authData[provider]) {
                // 이미 계정에 provider 가 연결되어 있는 경우
                user_id = session.authData.id;
                result = true;
                return result;
            }

            session.authData[provider] = authData;
        } else {
            session.authData = {
                [provider]: authData
            };
        }

        result = true;
        return result;
    },

    async getUserInfo(kakaoAccessToken) {
        let isExistedResult = -2;

        try {
            const kakaoUserInfo = await axios({
                method: "GET",
                url: "https://kapi.kakao.com/v2/user/me",
                headers: {
                    Authorization: `Bearer ${kakaoAccessToken}`
                }
            });
            return kakaoUserInfo;
        } catch (err) {
            logger.error(err);
            isExistedResult = -1;
            return isExistedResult;
        }

    },

    async callAxios(method, uri, param, header) {
        try {
            rtn = await axios({
                method: method,
                url: uri,
                headers: header,
                data: param
            })
        } catch (err) {
            rtn = err.response;
        }
        return rtn.data;
    }
}