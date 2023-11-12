const User = require('../models').users;

/**
 * DB에서 사용자 가입여부 확인
 * 
 * @param {String} email
 * @return {Number} isExistedResult
 */
exports.SelectExistedUser = async (email) => {
    let isExistedResult = -2;

    try {
        const SelectUser = await User.findAll({
            where: { email }
        });

        if (SelectUser) {
            isExistedResult = 1;
            return isExistedResult;
        }
        else {
            isExistedResult = -1;
        }
    } catch (err) {
        console.log(err);
        isExistedResult = -1;
        return isExistedResult;
    }
};

/**
 * DB에서 사용자 정보 조회
 * 
 * @param {String} email
 * @return {userInfo} userInfo
 */
exports.SelectUserInfo = async (email) => {
    let userInfo;
    let isExistedResult = -2;

    try {
        userInfo = await User.findAll({
            where: { email },
            raw: true
        });

        if (userInfo) {
            console.log(userInfo);
            return userInfo;
        }

        else {
            isExistedResult = -1;
            return isExistedResult;
        }

    } catch (err) {
        console.log(err);
        isExistedResult = -1;
        return isExistedResult;
    }
}

/**
 * DB에 사용자 정보 입력
 * 
 * @param {String} user_id
 * @param {String} email
 * @param {String} provider
 * @param {String} refreshToken
 * @return {Number} isExistedResult
 */
exports.InsertUser = async (user_id, email, provider, refreshToken) => {
    let isExistedResult = -1;
    const created_date = Date.now();

    try {
        await User.create({
            email: email,
            provider: provider,
            created_date: created_date,
            user_id: user_id,
            token: refreshToken
        }).then(() => {
            console.log(isExistedResult);
            isExistedResult = 0;
            return isExistedResult;
        });
        console.log(isExistedResult);
        return isExistedResult;
    } catch (err) {
        return isExistedResult;
    }
};

/**
 * DB에 사용자 정보 업데이트
 * 
 * @param {String} user_id
 * @param {String} new_refresh_token
 * @return {Number} isExistedResult
 */
exports.UpdateUser = async (user_id, new_refresh_token) => {
    let isExistedResult = -1;

    try {
        const updateDate = Date.now();

        await User.update(
            {
                token: new_refresh_token,
                updated_date: updateDate
            },
            {
                where: {
                    user_id
                }
            }
        ).then((result) => {
            console.log(result);
            isExistedResult = 0;
            return isExistedResult;
        });
        return isExistedResult;
    } catch (err) {
        return isExistedResult;
    }
}