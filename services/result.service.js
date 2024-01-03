/**
 * version  : 0.1
 * filename : result.service.js
 * author   : @Hana
 * comment  : 결과 조회 관련 비즈니스 로직
 */

const sequelize = require('sequelize');
const logger = require('../config/logger');
const ComputeResult = require('../utils/computeResult');

const Check_info = require('../models').check_info;
const Vision_result = require('../models').vision_result;
const Blind_spot_result = require('../models').blind_spot_result;
const Blind_spot_left_detail_result = require('../models').blind_spot_left_result;
const Blind_spot_right_detail_result = require('../models').blind_spot_right_result;
const Eye_movement_result = require('../models').eye_movement_result;
const Eye_left_detail_result = require('../models').eye_movement_left_result;
const Eye_right_detail_result = require('../models').eye_movement_right_result;

/**
 * 시력 검사 결과 모듈
 * 
 * @module VisionCheck
 */
exports.VisionCheck = {
    /**
     * 시력검사 결과 조회_userId
     * 
     * @method selectByUserId
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectByUserId: async (userId) => {
        let finalResult = -2;

        try {
            const visionResult = await Vision_result.findAll({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'left_eye_result',
                    'right_eye_result',
                    'check_corrected',
                    'created_date'
                ],
                raw: true,
                limit: 7,
                order: [['created_date', 'DESC']]
            });
            finalResult = await ComputeResult.ReturnResult(visionResult);

            return finalResult;
        } catch (err) {
            console.log(err);
            logger.error('select vision_result : fail');
            finalResult = -1;

            return finalResult;
        }
    },

    /**
     * 시력검사 결과 조회_check_id
     * 
     * @method selectByCheckId
     * @param {String} checkId
     * @return {Number} finalResult
    */
    selectByCheckId: async (checkId) => {
        let finalResult = -2;

        try {
            const visionResult = await Vision_result.findOne({
                where: { check_id: checkId },
                attributes: [
                    'check_id',
                    'check_corrected',
                    'left_eye_result',
                    'right_eye_result',
                    'created_date'
                ],
                raw: true
            });
            finalResult = await ComputeResult.ReturnResult(visionResult);

            return finalResult;
        } catch (err) {
            finalResult = -1;
            logger.error('select vision_result by check_id : fail');

            return finalResult;
        }
    },

    /**
     * 시력검사 결과 조회_월별 결과
     * 
     * @method selectGroupByMonth
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectGroupByMonth: async (userId) => {
        let finalResult = -2;

        try {
            const visionResult = await Vision_result.findAll({
                where: { user_id: userId },
                attributes: [
                    'check_corrected',
                    // 'vision_result.check_corrected',
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('AVG', sequelize.col('left_eye_result')), 'left_vision_avg'],
                    [sequelize.fn('AVG', sequelize.col('right_eye_result')), 'right_vision_avg'],
                    [sequelize.fn('MAX', sequelize.col('left_eye_result')), 'left_vision_max'],
                    [sequelize.fn('MAX', sequelize.col('right_eye_result')), 'right_vision_max'],
                    [sequelize.fn('MIN', sequelize.col('left_eye_result')), 'left_vision_min'],
                    [sequelize.fn('MIN', sequelize.col('right_eye_result')), 'right_vision_min'],
                ],
                raw: true,
                group: ['check_corrected',
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
                ],
                order: [['month', 'DESC']]
            });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(visionResult);
            logger.info(finalResult);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    selectIsCheckedCheckId: async (checkId) => {
        let finalResult;

        try {
            const checkedCheckId =
                await Check_info.findOne({
                    where: { check_id: checkId }
                });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.CheckResult(checkedCheckId);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    }
};

/**
 * 암점자가인식 검사 관련 모듈
 * 
 * @module BlindSpotCheck
 */
exports.BlindSpotCheck = {
    /**
     * 암점자가인식검사 결과 조회_user_id
     * 
     * @method selectByUserId
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectByUserId: async (userId) => {
        let finalResult = -2;

        try {
            const blindSpotResult = await Blind_spot_result.findAll({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'user_id',
                    'left_vfi',
                    'right_vfi',
                    'created_date'
                ],
                limit: 7,
                raw: true
            });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(blindSpotResult);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    /**
     * 암점자가인식검사 좌안 결과 조회_checkId
     * 
     * @method selectResultRightByCheckId
     * @param {String} checkId
     * @return {Number} finalResult
    */
    selectResultRightByCheckId: async (checkId) => {
        let finalResult;

        try {
            //암점자가인식 우안 검사 결과
            const blindSpotRightResult =
                await Blind_spot_right_detail_result.findOne({
                    where: { check_id: checkId },
                    attributes: [
                        'check_id',
                        'user_id',
                        'blind_spot_point',
                        'scotoma',
                        'location_t',
                        'location_sn',
                        'location_in',
                        'location_st',
                        'location_it',
                        'location_n',
                        'created_date'
                    ],
                    raw: true
                });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(blindSpotRightResult);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    /**
     * 암점자가인식검사 좌안 결과 조회_check_bs_id
     * @param {String} checkId
     * @return {Number} isExistedResult
    */
    selectResultLeftByCheckId: async (checkId) => {
        let finalResult = -2;

        try {
            //암점자가인식 좌안 검사 결과
            const blindSpotLeftResult =
                await Blind_spot_left_detail_result.findOne({
                    where: { check_id: checkId },
                    attributes: [
                        'check_id',
                        'user_id',
                        'blind_spot_point',
                        'scotoma',
                        'location_t',
                        'location_sn',
                        'location_in',
                        'location_st',
                        'location_it',
                        'location_n',
                        'created_date'
                    ], raw: true
                });
            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(blindSpotLeftResult);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    /**
     * 암점자가인식검사 월 별 결과 평균
     * 
     * @method selectGroupByMonth
     * @param {String} userId
     * @return {Object} finalResult
    */
    selectGroupByMonth: async (userId) => {
        let finalResult = -2;

        try {
            const resultPerMonth = await Blind_spot_result.findAll({
                where: { user_id: userId },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    //좌안 vfi 결과 평균값
                    [sequelize.fn('AVG', sequelize.col('left_vfi')), 'left_vfi'],
                    //우안 vfi 결과 평균값
                    [sequelize.fn('AVG', sequelize.col('right_vfi')), 'right_vfi'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(resultPerMonth);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    /**
     * 암점자가인식검사 월 별 결과 최댓값, 최솟값
     * 
     * @method selectGroupByMonthDetail
     * @param {String} userId
     * @return {Object} finalResult
    */
    selectGroupByMonthDetail: async (userId) => {
        let finalResult = -2;

        try {
            const resultPerMonth = await Blind_spot_result.findAll({
                where: { user_id: userId },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('max', sequelize.col('left_vfi')), 'max_left_vfi'],
                    [sequelize.fn('max', sequelize.col('right_vfi')), 'max_right_vfi'],
                    [sequelize.fn('min', sequelize.col('left_vfi')), 'min_left_vfi'],
                    [sequelize.fn('min', sequelize.col('right_vfi')), 'min_right_vfi'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(resultPerMonth);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    }
};

/**
 * 안구이동검사 결과 관련 모듈
 * 
 * @module EyeMovementCheck 
 */
exports.EyeMovementCheck = {
    /**
     * 안구이동검사 결과 조회_user_id
     * 
     * @method selectByUserId
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectByUserId: async (userId) => {
        let finalResult;

        try {
            const eyeMovementResult = await Eye_movement_result.findAll({
                where: { user_id: userId },
                attributes: ['check_id', 'user_id', 'left_vfi', 'right_vfi', 'created_date'],
                limit: 7,
                raw: true,
                order: [['created_date', 'DESC']]

            });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(eyeMovementResult);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    /**
     * 안구이동검사_우안 검사 결과 조회_user_id
     * 
     * @method selectResultRightByCheckId
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectResultRightByCheckId: async (check_em_id) => {
        let finalResult = -2;

        try {
            //안구이동검사 우안 검사 결과
            const eyeMovementRightResult =
                await Eye_right_detail_result.findOne({
                    where: { check_id: check_em_id },
                    attributes: [
                        'check_id',
                        'user_id',
                        'location_t',
                        'location_sn',
                        'location_in',
                        'location_st',
                        'location_it',
                        'created_date'
                    ],
                    raw: true
                });
            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(eyeMovementRightResult);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    /**
     * 안구이동검사 좌안 결과 조회_check_em_id
     * 
     * @method selectResultLeftByCheckId
     * @param {String} check_em_id
     * @return {Number} finalResult
    */
    selectResultLeftByCheckId: async (check_em_id) => {
        let finalResult;

        try {
            //안구이동검사 좌안 검사 결과
            const eyeMovementLeftResult =
                await Eye_left_detail_result.findOne({
                    where: { check_id: check_em_id },
                    attributes: [
                        'check_id',
                        'user_id',
                        'location_t',
                        'location_sn',
                        'location_in',
                        'location_st',
                        'location_it',
                        'created_date'
                    ],
                    raw: true
                });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(eyeMovementLeftResult);
            return finalResult;
        } catch (err) {
            // logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },
    // compareResult: async (leftResult, rightResult) => {
    //     let finalResult;
    //     let

    //     console.log(leftResult, rightResult);
    //     if ((leftResult === 1) || (rightResult === 1)) {
    //         finalResult = 1;
    //         return finalResult;
    //     } else if ((leftResult === 0) || (rightResult === 0)) {
    //         finalResult = 0;
    //         return finalResult;
    //     } else if ((leftResult === -1) || (rightResult === -1)) {
    //         return finalResult = -1;
    //     } else {
    //         data['left_detail_result'] = leftResult;
    //         data['right_detail_result'] = rightResult;
    //         return data;
    //     }

    // },

    /**
     * 안구이동검사 월 별 평균 결과 조회
     * 
     * @method selectGroupByMonth
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectGroupByMonth: async (userId) => {
        let finalResult = -2;

        try {
            const resultPerMonth = await Eye_movement_result.findAll({
                where: { user_id: userId },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('AVG', sequelize.col('left_vfi')), 'left_vfi'],
                    [sequelize.fn('AVG', sequelize.col('right_vfi')), 'right_vfi'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });

            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(resultPerMonth);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },

    /**
     * 안구이동검사 결과_월 별 최댓값, 최솟값
     * 
     * @method selectGroupByMonthDetail
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectGroupByMonthDetail: async (userId) => {
        let finalResult;

        try {
            const resultPerMonth = await Eye_movement_result.findAll({
                where: { user_id: userId },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('max', sequelize.col('left_vfi')), 'max_left_vfi'],
                    [sequelize.fn('max', sequelize.col('right_vfi')), 'max_right_vfi'],
                    [sequelize.fn('min', sequelize.col('left_vfi')), 'min_left_vfi'],
                    [sequelize.fn('min', sequelize.col('right_vfi')), 'min_right_vfi'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });
            //결과 데이터 : 성공시 DB 조회  // 실패시 : '-1' return
            finalResult = await ComputeResult.ReturnResult(resultPerMonth);
            return finalResult;
        } catch (err) {
            logger.error(err);
            finalResult = -1;
            return finalResult;
        }
    },
}

/**
 * 통합 검사 결과 모듈
 * 
 * @module TotalResult
 */
exports.TotalResult = {
    /**
     * 시력검사 결과 조회_userId
     * 
     * @method selectByUserId
     * @param {String} userId
     * @return {Number} finalResult
    */
    selectLeftTotalByUserId: async (userId) => {
        let finalResult = [];

        try {
            const visionLeftResult = await Vision_result.findOne({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'left_eye_result',
                    'check_corrected',
                    'created_date'
                ],
                raw: true,
                order: [['created_date', 'DESC']]
            });

            const blindSpotLeftResult = await Blind_spot_result.findOne({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'left_vfi',
                    'created_date'
                ],
                raw: true,
                order: [['created_date', 'DESC']]
            });

            const eyeMovementLeftResult = await Eye_movement_result.findOne({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'left_vfi',
                    'created_date'
                ],
                raw: true,
                order: [['created_date', 'DESC']]
            });
            const visionFinalResult = await ComputeResult.ReturnResult(visionLeftResult);
            const blindSpotFinalResult = await ComputeResult.ReturnResult(blindSpotLeftResult);
            const eyeMovementFinalResult = await ComputeResult.ReturnResult(eyeMovementLeftResult);

            finalResult[0] = visionFinalResult;
            finalResult[1] = blindSpotFinalResult;
            finalResult[2] = eyeMovementFinalResult;
            return finalResult;
        } catch (err) {
            finalResult = -1;
            return finalResult;
        }
    },
    /**
         * 시력검사 결과 조회_userId
         * 
         * @method selectByUserId
         * @param {String} userId
         * @return {Number} finalResult
        */
    selectRightTotalByUserId: async (userId) => {
        let finalResult = [];

        try {
            const visionRightResult = await Vision_result.findOne({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'right_eye_result',
                    'check_corrected',
                    'created_date'
                ],
                raw: true,
                order: [['created_date', 'DESC']]
            });

            const blindSpotRightResult = await Blind_spot_result.findOne({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'right_vfi',
                    'created_date'
                ],
                raw: true,
                order: [['created_date', 'DESC']]
            });

            const eyeMovementRightResult = await Eye_movement_result.findOne({
                where: { user_id: userId },
                attributes: [
                    'check_id',
                    'right_vfi',
                    'created_date'
                ],
                raw: true,
                order: [['created_date', 'DESC']]
            });
            const visionFinalResult = await ComputeResult.ReturnResult(visionRightResult);
            const blindSpotFinalResult = await ComputeResult.ReturnResult(blindSpotRightResult);
            const eyeMovementFinalResult = await ComputeResult.ReturnResult(eyeMovementRightResult);

            finalResult[0] = visionFinalResult;
            finalResult[1] = blindSpotFinalResult;
            finalResult[2] = eyeMovementFinalResult;
            return finalResult;
        } catch (err) {
            finalResult = -1;
            return finalResult;
        }
    }
};


/*
      const rightResult = async (check_bs_id) => {
            let isExistedResult = -1;

            try {
                const bsRightResult = await Blind_spot_right_detail_result.findOne({
                    where: { check_id: check_bs_id },
                    attributes: ['check_id', 'user_id', 'blind_spot_point', 'created_date'],
                    raw: true
                });
                return bsRightResult;
            } catch (err) {
                console.log(err);
                isExistedResult = -1;
                return isExistedResult;
            }
        };

        const leftResult = async (check_bs_id) => {
            let isExistedResult = -2;

            try {
                const bsLeftResult = await Blind_spot_left_detail_result.findOne({
                    where: { check_id: check_bs_id },
                    attributes: ['check_id', 'user_id', 'blind_spot_point', 'created_date'],
                    raw: true
                });
                return bsLeftResult;
            } catch (err) {
                console.log(err);
                isExistedResult = -1;
                return isExistedResult;
            }
        };

        try {
            let blindSpotRightResult = rightResult(check_bs_id);
            data['right_detail_result'] = await blindSpotRightResult;

            let blindSpotleftResult = leftResult(check_bs_id);
            data['left_detail_result'] = await blindSpotleftResult;

            if ((data['right_detail_result'] != -1) && (data['left_detail_result'] != -1)) {
                return data;
            }

            else {
                isExistedResult = -1;
                return isExistedResult;
            }

        }
        catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
*/