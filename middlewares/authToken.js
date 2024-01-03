const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const logger = require('../config/logger');

/**
 * 내부서버 인증에 필요한 access token 생성
 * 
 * @method GenerateAccessToken
 * @param {String} email
 * @return {accessJwtToken} accessJwtToken
 */
exports.GenerateAccessToken = async (email) => {
    const accessJwtToken = jwt.sign({
        type: 'JWT',
        email: email
    }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: '30d'
    });
    return accessJwtToken;
}

/**
 * 내부서버 인증에 필요한 refresh token 생성_DB 저장
 * 
 * @method GenerateRefreshToken
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
 * @method VerifyAccessToken
 * @param {String} accessToken
 * @return {Boolean} 
 */
exports.VerifyAccessToken = async (accessToken) => {
    // let returnResult;
    let decoded = null;
    try {
        decoded = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET);
        // console.log(decoded);
        return {
            ok: true
        };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return {
                ok: false,
                err: -1,
            };
        } else if (err.name === 'JsonWebTokenError') {
            return {
                ok: false,
                err: -2,
            };
        } else {
            return {
                err: -3,
                ok: false
            };
        }
    }

    // try {
    //     const decoded = await jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET || '', (err, decoded) => {
    //         if (err.name === 'tokenexpirederror') {
    //             logger.error(err.name);
    //             throw Error(err);
    //             // returnResult = 'Unauthorized'
    //             // return returnResult;
    //             // return res.status(401).send({ success: false, message: 'Unauthorized! Access Token was expired!' });
    //         }
    //         if (err.name === 'NotBeforeError') {
    //             logger.error(err.name);
    //             throw Error(err);
    //             // returnResult = 'Unauthorized'
    //             // return res.status(401).send({ success: false, message: 'jwt not active' });
    //         }
    //         if (err.name === 'JsonWebTokenError') {
    //             logger.error(err.name);
    //             throw Error(err);
    //             // returnResult = 'Unauthorized'
    //             // return res.status(401).send({ success: false, message: 'jwt malformed' });
    //         }
    //     });
    //     return decoded;
    // } catch (err) {
    //     logger.error('verify access token', err);
    //     return false;
    // }

    // let decoded = null;

    // try {
    //     decoded = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET);

    //     if (decoded) {
    //         logger.info('verify access token');
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // } catch (err) {
    //     console.log(err);
    //     logger.error('verify access token', err);
    //     return false;
    // }
};

/**
 * 내부서버 refresh token 인증
 * 
 * @method VerifyRefreshToken
 * @param {String} refreshToken
 * @return {Boolean} 
 * 
 */
exports.VerifyRefreshToken = async (refreshToken) => {

    // try {
    //     jwt.verify(refreshToken, process.env.JWT_TOKEN_SECRET);
    //     return true;
    // } catch (err) {
    //     console.log(err);
    //     return false;
    // }
    let decoded = null;
    try {
        decoded = jwt.verify(refreshToken, process.env.JWT_TOKEN_SECRET);
        return {
            ok: true,
        };
    } catch (err) {
        return {
            ok: false,
            message: err.message,
        };
    }
}
