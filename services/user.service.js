/**
 * version : 0.1
 * filename : user.service.js
 * author : @Hana
 * comment : 데이터베이스에서 users 테이블 관련 기능 구현
*/

const User = require('../models').users;
const logger = require('../config/logger');
const { sequelize } = require('../models');
const computeResult = require('../utils/computeResult');
const Check_info = require('../models').check_info;
const Vision_result = require('../models').vision_result;
const Blind_spot_result = require('../models').blind_spot_result;
const Blind_spot_left_result = require('../models').blind_spot_left_result;
const Blind_spot_right_result = require('../models').blind_spot_righ_result;

const Eye_movement_result = require('../models').eye_movement_result;
const Eye_movement_left_result = require('../models').eye_movement_left_result;
const Eye_movement_right_result = require('../models').eye_movement_righ_result;



/**
 * DB에 저장된 사용자인지 확인
 * 
 * @method SelectExistedUser
 * @param {String} email - 이메일 주소
 * @returns {Number} isExistedResult - 저장여부
*/
exports.SelectExistedUser =
    async (email) => {
        let finalResult;

        try {
            const selectUser = await User.findAll({
                where: { email }
            });
            finalResult = computeResult.CheckResult(selectUser);

            return finalResult;
        } catch (err) {
            finalResult = -1;
            logger.error(err);

            return finalResult;
        }
    };

/**
 * DB에서 user_id 이용해 사용자 유무 확인
 * 
 * @method SelectExistedUserId
 * @param {String} user_id
 * @return {Number} isExistedResult
 */
exports.SelectExistedUserId =
    async (user_id) => {
        let finalResult;

        try {
            const SelectUser = await User.findAll({
                where: { user_id }
            });
            // console.log(SelectUser);
            finalResult = await computeResult.CheckResult(SelectUser);
            // console.log(finalResult);
            return finalResult;
        } catch (err) {
            finalResult = -1;
            logger.error(err);

            return finalResult;
        }
    };

/**
 * DB에서 user_id 이용해 사용자 유무 확인
 * 
 * @method SelectUserInfoUserId
 * @param {String} user_id
 * @return {Object} userInfo
*/
exports.SelectUserInfoUserId =
    async (user_id) => {
        let finalResult;

        try {
            const SelectUser = await User.findAll({
                where: { user_id },
                raw: true
            });
            finalResult = computeResult.CheckResult(SelectUser);

            return SelectUser;
        } catch (err) {
            finalResult = -1;
            logger.error(err);

            return finalResult;
        }
    };


/**
 * DB에서 사용자 정보 조회
 * 
 * @method SelectUserInfo
 * @param {String} email
 * @return {userInfo} userInfo
 */
exports.SelectUserInfo = async (email) => {
    let finalResult;

    try {
        const userInfo = await User.findAll({
            where: { email },
            raw: true
        });

        finalResult = await computeResult.ReturnResult(userInfo);

        return finalResult;
    } catch (err) {
        finalResult = -1;
        logger.error(err);

        return finalResult;
    }
}

/**
 * DB에 사용자 정보 입력
 * 
 * @method InsertUser
 * @param {String} user_id
 * @param {String} email
 * @param {String} refreshToken
 * @return {Number} isExistedResult
 */
exports.InsertUser = async (user_id, email, refreshToken) => {
    let isExistedResult;
    const PROVIDER = 'KAKAO';
    const created_date = Date.now();

    try {
        const createUser = await User.create({
            email: email,
            provider: PROVIDER,
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
        logger.error(err);
        return isExistedResult;
    }
};

/**
 * DB에 사용자 정보 업데이트
 * 
 * @method UpdateUser
 * @param {String} user_id
 * @param {Text} new_refresh_token
 * @return {Number} isExistedResult
 */
exports.UpdateUser = async (user_id, new_refresh_token) => {
    let isExistedResult;

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
        logger.error(err);
        return isExistedResult;
    }
}

/**
 * DB에 사용자 정보 삭제
 * 
 * @method DeleteUser
 * @param {String} user_id
 * @return {Number} return_result
 */
exports.DeleteUser = async (user_id) => {
    let isExistedResult;

    try {
        const t = await sequelize.transaction();
        await User.destroy({
            where: { user_id }
        }, { transaction: t });

        await Check_info.destroy({
            where: { user_id }
        }, { transaction: t });

        await Vision_result.destroy({
            where: { user_id }
        }, { transaction: t });

        await Blind_spot_result.destroy({
            where: { user_id }
        }, { transaction: t });

        await Blind_spot_left_result.destroy({
            where: { user_id }
        }, { transaction: t });

        await Blind_spot_right_result.destroy({
            where: { user_id }
        }, { transaction: t });

        await Eye_movement_result.destroy({
            where: { user_id }
        }, { transaction: t });

        await Eye_movement_left_result.destroy({
            where: { user_id }
        }, { transaction: t });

        await Eye_movement_right_result.destroy({
            where: { user_id }
        }, { transaction: t });

        await t.commit()
        isExistedResult = 0;
        return isExistedResult;
    } catch (err) {
        await t.rollback();
        logger.error(err);
        isExistedResult = -1;
        return isExistedResult;
    }
}

/**
 *   const t = await sequelize.transaction();
            let isExistedResult = -2;
            const CHECK_CATEGORY = 'bs';
            const created_date = Date.now();

            try {
                await Check_info.create({
                    check_category: CHECK_CATEGORY,
                    user_id: userId,
                    check_id: blindSpotCheckId,
                    created_date: created_date
                }, { transaction: t });

                await Blind_spot_result.create({
                    check_id: blindSpotCheckId,
                    user_id: userId,
                    left_vfi: blindSpotLeftResults[0],
                    right_vfi: blindSpotRightResults[0],
                    created_date: created_date
                }, { transaction: t });

                await Blind_spot_left_result.create({
                    check_id: blindSpotCheckId,
                    user_id: userId,
                    blind_spot_point: blindSpotLeftResults[1],
                    scotoma: blindSpotLeftResults[2][1],
                    location_t: blindSpotLeftResults[2][3],
                    location_st: blindSpotLeftResults[2][5],
                    location_in: blindSpotLeftResults[2][7],
                    location_sn: blindSpotLeftResults[2][9],
                    location_it: blindSpotLeftResults[2][11],
                    location_n: blindSpotLeftResults[2][13],
                    created_date: created_date
                }, { transaction: t });

                await Blind_spot_right_result.create({
                    check_id: blindSpotCheckId,
                    user_id: userId,
                    blind_spot_point: blindSpotRightResults[1],
                    scotoma: blindSpotRightResults[2][1],
                    location_t: blindSpotRightResults[2][3],
                    location_st: blindSpotRightResults[2][5],
                    location_in: blindSpotRightResults[2][7],
                    location_sn: blindSpotRightResults[2][9],
                    location_it: blindSpotRightResults[2][11],
                    location_n: blindSpotRightResults[2][13],
                    created_date: created_date
                }, { transaction: t });

                await t.commit()
                isExistedResult = 0;
                return isExistedResult;

            } catch (err) {
                await t.rollback();
                logger.error(err);
                isExistedResult = -1;
                return isExistedResult;
            };
        }
 */