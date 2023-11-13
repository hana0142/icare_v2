// const winston = require('winston');
const axios = require('axios');
exports.Kakao = {
    unlinkUser(session, provider, userId) {
        let result = false;

        if (
            session.authData &&
            session.authData[provider] &&
            session.authData[provider].id === userId
        ) {
            delete session.authData[provider];
            result = true;
        }
        return result;
    },


    async linkUser(session, provider, authData) {
        let result = false;    // console.log('session', session);
        // console.log('*****authData', authData);
        if (session.authData) {
            if (session.authData[provider]) {
                // 이미 계정에 provider 가 연결되어 있는 경우
                user_id = session.authData.id;
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
            console.log('error', err);
            isExistedResult = -1;
            return isExistedResult;
            // return res.status(401).json('Unauthorized');
        }

    }
}