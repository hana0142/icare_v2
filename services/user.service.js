/**
 * version : 0.1
 * filename : user.service.js
 * author : @Hana
 * comment : 데이터베이스에서 users 테이블 관련 기능 구현
*/
const User = require('../models').users;
const computeResult = require('../middlewares/computeResult');

/**
 * 사용자 가입여부 확인
 * @param {String} email
 * @return {Number} isExistedResult
*/
exports.SelectExistedUser =
    async (email) => {
        var finalResult;

        try {
            const SelectUser = await User.findAll({
                where: { email }
            });

            finalResult = computeResult.CheckResult(SelectUser);
            return finalResult;
        } catch (err) {
            finalResult = -1;
            return finalResult;
        }
    };

/**
 * DB에서 user_id 이용해 사용자 유무 확인
 * @param {String} user_id
 * @return {Number} isExistedResult
 */
exports.SelectExistedUserId =
    async (user_id) => {
        var finalResult;

        try {
            const SelectUser = await User.findAll({
                where: { user_id }
            });
            finalResult = computeResult.CheckResult(SelectUser);
            return finalResult;
        } catch (err) {
            finalResult = -1;
            return finalResult;
        }
    };

/**
 * DB에서 사용자 정보 조회
 * 
 * @param {String} email
 * @return {userInfo} userInfo
 */
exports.SelectUserInfo = async (email) => {
    var finalResult;

    try {
        const userInfo = await User.findAll({
            where: { email },
            raw: true
        });

        finalResult = await computeResult.ReturnResult(userInfo);
        console.log(finalResult);
        return finalResult;
    } catch (err) {
        finalResult = -1;
        return finalResult;
    }
}

/**
 * DB에 사용자 정보 입력
 * @param {String} user_id
 * @param {String} email
 * @param {String} provider
 * @param {String} refreshToken
 * @return {Number} isExistedResult
 */
exports.InsertUser = async (user_id, email, provider, refreshToken) => {
    var isExistedResult = -2;
    const created_date = Date.now();

    try {
        const createUser = await User.create({
            email: email,
            provider: provider,
            created_date: created_date,
            user_id: user_id,
            token: refreshToken
        });

        if (createUser) {
            isExistedResult = 1;
            return isExistedResult;
        } else {
            isExistedResult = 0;
            return isExistedResult;
        }
    } catch (err) {
        isExistedResult = -1;
        return isExistedResult;
    }
};

/**
 * DB에 사용자 정보 업데이트
 * @param {String} user_id
 * @param {Text} new_refresh_token
 * @return {Number} isExistedResult
 */
exports.UpdateUser = async (user_id, new_refresh_token) => {
    var isExistedResult = -2;

    try {
        const updateDate = Date.now();
        const updateUser = await User.update({
            token: new_refresh_token,
            updated_date: updateDate
        }, {
            where: { user_id }
        });

        if (updateUser) {
            isExistedResult = 1;
            return isExistedResult;
        } else {
            isExistedResult = 0;
            return isExistedResult;
        }
    } catch (err) {
        isExistedResult = -1;
        return isExistedResult;
    }
}