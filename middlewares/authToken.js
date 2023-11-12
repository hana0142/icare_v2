const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');

/**
 * 내부서버 인증에 필요한 access token 생성
 * 
 * @param {String} email
 * @return {accessJwtToken} accessJwtToken
 */
exports.GenerateAccessToken = async (email) => {
    const accessJwtToken = jwt.sign({
        type: 'JWT',
        email: email
    }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    return accessJwtToken;
}

/**
 * 내부서버 인증에 필요한 refresh token 생성_DB 저장
 * 
 * @param {String} email
 * @return {refreshJwtToken} refreshJwtToken
 */
exports.GenerateRefreshToken = async (email) => {
    const refreshJwtToken = jwt.sign({
        type: 'JWT',
        email: email
    }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: '180d'
    });
    return refreshJwtToken
}

/**
 * 내부서버 access token 인증
 * 
 * @param {String} accessToken
 * @return {Boolean} 
 * 
 */
exports.VerifyAccessToken = async (accessToken) => {
    let decoded = null;

    try {
        decoded = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

/**
 * 내부서버 refresh token 인증
 * 
 * @param {String} email
 * @return {Boolean} 
 * 
 */
exports.VerifyRefreshToken = async (email) => {
    try {
        const userInfo = await UserService.SelectUser(email);
        const userInfoToken = userInfo.token;

        try {
            jwt.verify(userInfoToken, process.env.JWT_TOKEN_SECRET);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }

    } catch (err) {
        console.log(err);
        return false;
    }
}
