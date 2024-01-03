/**
 * version  : 0.1
 * filename : check.service.js
 * author   : @Hana
 * comment  : 검사 관련 비즈니스 로직
 */

const { sequelize } = require('../models');
const logger = require('../config/logger');

const Check_info = require('../models').check_info;
const Vision_result = require('../models').vision_result;
const Blind_spot_result = require('../models').blind_spot_result;
const Blind_spot_left_result = require('../models').blind_spot_left_result;
const Blind_spot_right_result = require('../models').blind_spot_right_result;
const Eye_movement_result = require('../models').eye_movement_result;
const Eye_movement_left_result = require('../models').eye_movement_left_result;
const Eye_movement_right_result = require('../models').eye_movement_right_result;

/**
 * 시력검사 관련 모듈
 * 
 * @module VisionCheck
 */
exports.VisionCheck = {
    /**
     * 시력검사결과 insert
     * 
     * @method insertResult
     * @param {String} visionCheckId
     * @param {String} userId
     * @param {Number} leftVisionResult
     * @param {Number} rightVisionResult
     * @param {Boolean} isCorrected
     * @return {Number} isExistedResult
    */
    insertResult: async (visionCheckId, userId, leftVisionResult, rightVisionResult, isCorrected) => {
        let isExistedResult = -2;
        const CHECK_CATEGORY = 'vs';
        const created_date = Date.now();
        const t = await sequelize.transaction();

        try {
            await Check_info.create({
                check_category: CHECK_CATEGORY,
                user_id: userId,
                check_id: visionCheckId,
                created_date: created_date
            }, { transaction: t });

            await Vision_result.create({
                check_id: visionCheckId,
                user_id: userId,
                check_corrected: isCorrected,
                left_eye_result: leftVisionResult,
                right_eye_result: rightVisionResult,
                created_date: created_date
            }, { transaction: t });

            await t.commit();
            isExistedResult = 0;
            logger.info('POST CHECK VISION : INSERT VISION RESULT SUCCESS');

            return isExistedResult;

        } catch (err) {
            await t.rollback();
            logger.error('POST CHECK VISION : ', err);
            isExistedResult = -1;

            return isExistedResult;
        };
    }
}

/**
 * 암점자가인식 검사 관련 모듈
 * 
 * @module BlindSpotCheck
*/
exports.BlindSpotCheck = {
    /**
     * 암점자가인식 검사 정보 insert
     * 
     * @method inserResult
     * @param {String} blindSpotCheckId
     * @param {String} userId
     * @param {Object} blindSpotLeftResults
     * @param {Object} blindSpotRightResults
     * @return {Number} isExistedResult
    */
    insertResult:
        async (blindSpotCheckId, userId, blindSpotLeftResults, blindSpotRightResults) => {
            let isExistedResult = -2;
            const CHECK_CATEGORY = 'bs';
            const created_date = Date.now();
            const t = await sequelize.transaction();

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
}

/**
 * 안구이동검사 관련 모듈
 * 
 * @module EyeMovement
 */
exports.EyeMovementCheck = {
    /**
     * 안구이동검사 결과 insert
     * 
     * @method insertResult
     * @param {String} EyeMovementCheckId
     * @param {String} userId
     * @return {Number} isExistedResult (0:insert 완료/-1:실패(DB ROLLBACK))
    */
    insertResult:
        async (eyeMovementCheckId, userId, eyeMovementLeftResult, eyeMovementRightResult) => {
            let isExistedResult = -2;
            const CHECK_CATEGORY = 'em';
            const created_date = Date.now();
            const t = await sequelize.transaction();

            try {
                await Check_info.create({
                    check_category: CHECK_CATEGORY,
                    user_id: userId,
                    check_id: eyeMovementCheckId,
                    created_date: created_date
                }, { transaction: t });

                await Eye_movement_result.create({
                    check_id: eyeMovementCheckId,
                    user_id: userId,
                    left_vfi: eyeMovementLeftResult[0],
                    right_vfi: eyeMovementRightResult[0],
                    created_date: created_date
                }, { transaction: t });

                await Eye_movement_left_result.create({
                    check_id: eyeMovementCheckId,
                    user_id: userId,
                    location_t: eyeMovementLeftResult[1][1],
                    location_st: eyeMovementLeftResult[1][3],
                    location_in: eyeMovementLeftResult[1][5],
                    location_sn: eyeMovementLeftResult[1][7],
                    location_it: eyeMovementLeftResult[1][9],
                    created_date: created_date
                }, { transaction: t });

                await Eye_movement_right_result.create({
                    check_id: eyeMovementCheckId,
                    user_id: userId,
                    location_t: eyeMovementRightResult[1][1],
                    location_st: eyeMovementRightResult[1][3],
                    location_in: eyeMovementRightResult[1][5],
                    location_sn: eyeMovementRightResult[1][7],
                    location_it: eyeMovementRightResult[1][9],
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
}