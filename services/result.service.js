const Vision_result = require('../models').vision_result;
const Blind_spot_result = require('../models').blind_spot_result;
const Blind_spot_left_detail_result = require('../models').blind_spot_left_result;
const Blind_spot_right_detail_result = require('../models').blind_spot_right_result;
const Eye_movement_result = require('../models').eye_movement_result;
const Eye_left_detail_result = require('../models').eye_movement_left_result;
const Eye_right_detail_result = require('../models').eye_movement_right_result;

const sequelize = require('sequelize');

exports.VisionCheck = {
    /**
     * 시력검사 결과 조회_user_id
     * 
     * @param {String} user_id
     * @return {Number} isExistedResult
    */
    selectByUserId: async (user_id) => {
        let isExistedResult = -2;

        try {
            const visionResult = await Vision_result.findAll({
                where: { user_id },
                attributes:
                    ['check_id', 'left_eye_result', 'right_eye_result', 'check_corrected', 'created_date'],
                raw: true,
                limit: 7
            });
            return visionResult;
        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    },

    /**
     * 시력검사 결과 조회_check_id
     * 
     * @param {String} check_id
     * @return {Number} isExistedResult
    */
    selectByCheckId: async (check_id) => {
        var isExistedResult = -2;

        try {
            const visionResult = await Vision_result.findOne({
                where: { check_id },
                attributes: ['check_id', 'check_corrected', 'left_eye_result', 'right_eye_result', 'created_date'],
                raw: true
            });
            return visionResult;
        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    },

    /**
     * 시력검사 결과 조회_월별 결과
     * 
     * @param {String} user_id
     * @return {Number} isExistedResult
    */
    selectGroupByMonth: async (user_id) => {
        let isExistedResult = -2;
        try {
            const visionResult = await Vision_result.findAll({
                where: { user_id },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('AVG', sequelize.col('left_eye_result')), 'left_vision_avg'],
                    [sequelize.fn('AVG', sequelize.col('right_eye_result')), 'right_vision_avg'],
                    [sequelize.fn('MAX', sequelize.col('left_eye_result')), 'left_vision_max'],
                    [sequelize.fn('MAX', sequelize.col('right_eye_result')), 'right_vision_max'],
                    [sequelize.fn('MIN', sequelize.col('left_eye_result')), 'left_vision_min'],
                    [sequelize.fn('MIN', sequelize.col('right_eye_result')), 'right_vision_min'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });
            return visionResult;
        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    }
};

exports.BlindSpotCheck = {
    /**
     * 암점자가인식검사 결과 조회_user_id
     * 
     * @param {String} user_id
     * @return {Number} isExistedResult
    */
    selectByUserId: async (user_id) => {
        let isExistedResult = -2;

        try {
            const blindSpotResult = await Blind_spot_result.findAll({
                where: { user_id },
                attributes: ['check_id', 'user_id', 'right_vfi', 'left_vfi', 'created_date'],
                limit: 7,
                raw: true
            });
            return blindSpotResult;
        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    },

    /**
     * 암점자가인식검사 결과 조회_check_bs_id
     * 
     * @param {String} check_bs_id
     * @return {Number} isExistedResult
    */
    selectByCheckId: async (check_bs_id) => {
        let isExistedResult = -2;
        let data = {};

        try {
            //암점자가인식 우안 검사 결과
            await Blind_spot_right_detail_result.findOne({
                where: { check_id: check_bs_id },
                attributes: ['check_id', 'user_id', 'blind_spot_point', 'created_date'],
                raw: true
            }).then(bsRightResult => {
                data['right_detail_result'] = bsRightResult;
            }).catch((err) => {
                console.log(err);
                isExistedResult = -1;
                return isExistedResult;
            });

            //암점자가인식 좌안 검사 결과
            await Blind_spot_left_detail_result.findOne({
                where: { check_id: check_bs_id },
                attributes: ['check_id', 'user_id', 'blind_spot_point', 'created_date'],
                raw: true
            }).then((bsLeftResult) => {
                data['left_detail_result'] = bsLeftResult;
            }).catch((err) => {
                console.log(err);
                isExistedResult = -1;
                return isExistedResult;
            });
            return data;

        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    },

    /**
     * 암점자가인식검사 월 별 결과 평균
     * 
     * @param {String} user_id
     * @return {Object} get_per_month_result
    */
    selectGroupByMonth: async (user_id) => {
        let isExistedResult = -2;

        try {
            const resultPerMonth = await Blind_spot_result.findAll({
                where: { user_id },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    //우안 vfi 결과 평균값
                    [sequelize.fn('AVG', sequelize.col('right_vfi')), 'right_vfi'],
                    //좌안 vfi 결과 평균값
                    [sequelize.fn('AVG', sequelize.col('left_vfi')), 'left_vfi'],
                ],
                raw: true,
                //created_date 컬럼 월 기준으로 데이터 그룹화
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });
            return resultPerMonth;
        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    },

    /**
     * 암점자가인식검사 월 별 결과 최댓값, 최솟값
     * 
     * @param {String} user_id
     * @return {Object} get_per_month_result
    */
    selectGroupByMonthDetail: async (user_id) => {
        let isExistedResult = -2;

        try {
            const resultPerMonth = await Blind_spot_result.findAll({
                where: { user_id },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('max', sequelize.col('right_vfi')), 'max_right_vfi'],
                    [sequelize.fn('max', sequelize.col('left_vfi')), 'max_left_vfi'],
                    [sequelize.fn('min', sequelize.col('right_vfi')), 'min_right_vfi'],
                    [sequelize.fn('min', sequelize.col('left_vfi')), 'min_left_vfi'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });
            return resultPerMonth;
        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    }
};

exports.EyeMovementCheck = {
    /**
     * 안구이동검사 결과 조회_user_id
     * 
     * @param {String} user_id
     * @return {Number} isExistedResult
    */
    selectByUserId: async (user_id) => {
        let isExistedResult = -2;

        try {
            const eyeMovementResult = await Eye_movement_result.findAll({
                where: { user_id },
                attributes: ['check_id', 'user_id', 'left_vfi', 'right_vfi', 'created_date'],
                raw: true
            });
            return eyeMovementResult;

        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    },

    /**
     * 안구이동검사 결과 조회_check_em_id
     * 
     * @param {String} check_em_id
     * @return {Number} isExistedResult
    */
    selectByCheckId: async (check_em_id) => {
        let isExistedResult = -2;
        let data = {};

        try {
            await Eye_left_detail_result.findAll({
                where: { check_id: check_em_id },
                attributes: ['check_id', 'user_id', 'location_t', 'location_st', 'location_it', 'location_sn', 'location_in', 'created_date'],
                raw: true
            }).then((emleftResult) => {
                data['left_detail_result'] = emleftResult;
            }).catch((err) => {
                console.log(err);
                isExistedResult = -1;
                return isExistedResult;
            });

            await Eye_right_detail_result.findAll({
                where: { check_id: check_em_id },
                attributes: ['check_id', 'user_id', 'location_t', 'location_st', 'location_it', 'location_sn', 'location_in', 'created_date'],
                raw: true
            }).then((emRightResult) => {
                data['right_detail_result'] = emRightResult;
            }).catch((err) => {
                console.log(err);
                isExistedResult = -1;
                return isExistedResult;
            })
            return data;

        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    },

    /**
     * 안구이동검사 월 별 평균 결과 조회
     * 
     * @param {String} user_id
     * @return {Number} isExistedResult
    */
    selectGroupByMonth: async (user_id) => {
        let isExistedResult = -2;

        try {
            const eyeMovementResult = await Eye_movement_result.findAll({
                where: { user_id },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('AVG', sequelize.col('right_vfi')), 'right_vfi'],
                    [sequelize.fn('AVG', sequelize.col('left_vfi')), 'left_vfi'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });
            return eyeMovementResult;
        } catch (err) {
            console.log(err);
            return isExistedResult;
        }
    },

    /**
     * 안구이동검사 결과_월 별최댓값, 최솟값
     * 
     * @param {String} user_id
     * @return {Number} isExistedResult
    */
    selectGroupByMonthDetail: async (user_id) => {
        let isExistedResult = -2;
        let data = {};

        try {
            const get_per_month_result = await Eye_movement_result.findAll({
                where: { user_id },
                attributes: [
                    [sequelize.fn('date_trunc', 'month', sequelize.col('created_date')), 'month'],
                    [sequelize.fn('max', sequelize.col('right_vfi')), 'max_right_vfi'],
                    [sequelize.fn('max', sequelize.col('left_vfi')), 'max_left_vfi'],
                    [sequelize.fn('min', sequelize.col('right_vfi')), 'min_right_vfi'],
                    [sequelize.fn('min', sequelize.col('left_vfi')), 'min_left_vfi'],
                ],
                raw: true,
                group: [sequelize.fn('date_trunc', 'month', sequelize.col('created_date'))]
            });
            return get_per_month_result;
        } catch (err) {
            console.log(err);
            return isExistedResult;
        }
    },
}


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