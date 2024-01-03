/**
 * version : 0.1
 * filename : result.controller.js
 * author : @Hana
 * comment : 결과 데이터 관련 컨트롤러
*/

const logger = require('../config/logger');
const ComputeResult = require('../utils/computeResult');
const UserService = require('../services/user.service');
const ResultService = require('../services/result.service');

//#region 
/**
 * 시력검사 관련 모듈
 * 
 * @module VisionCheck
*/
exports.VisionCheck = {
    /**
     * userID가 일치하는 시력검사 결과 불러오는 함수
     * 
     * @method getResultByUserId
     */
    getResultByUserId: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_VISION_DEFAULT';

        try {
            if (req.params.user_id) {
                const userId = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(userId);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json('Do Not Found User ID')
                }

                const visionResultByUserId = await ResultService.VisionCheck.selectByUserId(userId);

                if ((visionResultByUserId === 1)) {
                    logger.info(`${PAGE_NAME}: No Result`);
                    return res.status(204).json('No Result');
                } else if ((visionResultByUserId === -1)) {
                    logger.error(`${PAGE_NAME}: Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info(`${PAGE_NAME}: success`);
                    return res.status(200).json({
                        'vision_result': visionResultByUserId
                    });
                }
            } else {
                logger.error(`${PAGE_NAME}: NO PARAMETER`);
                return res.status(400).send('NO PARAMETER');
            }
        }
        catch (err) {
            logger.error(`${PAGE_NAME}:`, err);
            return res.status(500).json('Error Occured');
        }
    },

    /**
    * checkID가 일치하는 시력검사 결과 불러오는 함수
    * 
    * @method getResultByCheckId
    */
    getResultByCheckId: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_VISION_DEFAULT';

        try {
            if (req.params.check_id) {
                const checkId = req.params.check_id;
                const isExistedCheckId = await ResultService.VisionCheck.selectIsCheckedCheckId(checkId);

                if (isExistedCheckId != 1) {
                    logger.error(`${PAGE_NAME} : Do Not Found check ID`);
                    return res.status(404).json('Do Not Found check ID')
                }

                const visionResultByCheckId = await ResultService.VisionCheck.selectByCheckId(checkId);

                if ((visionResultByCheckId === 1)) {
                    logger.info(`${PAGE_NAME} : No Result`);
                    return res.status(204).json('No Result');
                } else if ((visionResultByCheckId === -1)) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({
                        'GET_RESULT_VISION_DEFAULT': visionResultByCheckId
                    });
                }
            } else {
                logger.error(`${PAGE_NAME} : No Parameter`);
                return res.status(400).send('No Parameter');
            }
        }
        catch (err) {
            logger.error(`${PAGE_NAME} : `, err);
            return res.status(500).json('Error Occured');
        }
    },

    //월 별 결과 조회
    /**
    * userID가 일치하는 시력검사 결과 불러오는 함수
    * 
    * @method getCheckId
    */
    getResultGroupByMonth: async (req, res) => {
        let finalCorrectedTrueResult = [];
        let finalCorrectedFalseResult = [];
        const PAGE_NAME = 'GET_RESULT_VISION_MONTH';

        try {
            if (req.params.user_id) {
                const userId = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(userId);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const visionResultGroupByMonth = await ResultService.VisionCheck.selectGroupByMonth(userId);

                if ((visionResultGroupByMonth === 1)) {
                    logger.info(`${PAGE_NAME} : No Result`);
                    return res.status(204).json('No Result');
                } else if ((visionResultGroupByMonth === -1)) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    for (let i = 0; i < visionResultGroupByMonth.length; i++) {
                        //날짜 추출
                        var result_month_date = new Date(visionResultGroupByMonth[i]['month']);
                        var result_year_num = result_month_date.getFullYear();
                        var result_month_num = result_month_date.getMonth() + 1;
                        result_year_num = String(result_year_num);
                        result_month_num = String(result_month_num);
                        result_month_num = (result_month_num[1] ? result_month_num : "0" + result_month_num[0]);

                        visionResultGroupByMonth[i]['month'] = result_year_num.concat(result_month_num);

                        if (visionResultGroupByMonth[i]['check_corrected']) {
                            finalCorrectedTrueResult.push(visionResultGroupByMonth[i]);
                        } else {
                            finalCorrectedFalseResult.push(visionResultGroupByMonth[i]);
                        }
                    }
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({
                        'result_check_corrected_true': finalCorrectedTrueResult,
                        'result_check_corrected_false': finalCorrectedFalseResult
                    });
                }
            } else {
                logger.error(`${PAGE_NAME} : No Parameter`);
                return res.status(400).send('No Parameter');
            }
        }
        catch (err) {
            logger.error(`${PAGE_NAME} : `, err);
            return res.status(500).json('Error Occured');
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
    * userID가 일치하는 암점자가인식 결과 불러오는 함수
    * 
    * @method getResultByUserId
    */
    getResultByUserId: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_BLIND_SPOT';

        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(user_id);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const blindSpotResult = await ResultService.BlindSpotCheck.selectByUserId(user_id);

                if ((blindSpotResult === 1)) {
                    logger.info(`${PAGE_NAME} : No Result`);
                    return res.status(204).json('No Result');
                } else if ((blindSpotResult === 0) || (blindSpotResult === -1)) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                }
                // else if ((blindSpotResult === -1)) {
                //     logger.error(`${PAGE_NAME} : Bad Request`);
                //     return res.status(400).json('Bad Request');
                // }
                else {
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({ 'blind_spot_result': blindSpotResult });
                }
            }
        } catch (err) {
            logger.error(`${PAGE_NAME} : err`);
            return res.status(500).json('Error Occured');
        }
    },

    /**
   * checkId가 일치하는 암점자가인식 결과 불러오는 함수
   * 
   * @method getResultByCheckId
   */
    getResultByCheckId: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_BLIND_SPOT_DETAIL';

        try {
            if (req.params.check_bs_id) {
                const checkId = req.params.check_bs_id;
                const isExistedCheckId = await ResultService.VisionCheck.selectIsCheckedCheckId(checkId);

                if (isExistedCheckId != 1) {
                    logger.error(`${PAGE_NAME} : Do Not Found check ID`);
                    return res.status(404).json('Do Not Found check ID')
                }

                const blindSpotLeftResult = await ResultService.BlindSpotCheck.selectResultLeftByCheckId(checkId);
                const blindSpotRightResult = await ResultService.BlindSpotCheck.selectResultRightByCheckId(checkId);
                const blindResult = await ComputeResult.CompareResult(blindSpotLeftResult, blindSpotRightResult);

                if (blindResult === 1) {
                    logger.info(`${PAGE_NAME} : No Results`);
                    return res.status(204).json('No Results');
                } else if (blindResult === -1) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({
                        'blind_spot_result': blindResult,
                    });
                }
            } else {
                logger.error(`${PAGE_NAME} : No Parameter`);
                return res.status(400).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME} : `, err);
            return res.status(500).json('Error Occured');
        }
    },

    /**
    * userId가 일치하는 암점자가인식 결과의 월 별 정보 불러오는 함수
    * 
    * @method getResultGroupByMonth
    */
    getResultGroupByMonth: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_BLIND_SPOT_MONTH'

        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(user_id);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const blindSpotResult = await ResultService.BlindSpotCheck.selectGroupByMonth(user_id);

                if (blindSpotResult === 1) {
                    logger.info(`${PAGE_NAME} :No Result`);
                    return res.status(204).json('No Result');
                } else if (blindSpotResult === -1) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    for (let i = 0; i < blindSpotResult.length; i++) {
                        let new_date;
                        let oldDate = blindSpotResult[i]['month'];
                        var d = new Date(oldDate);
                        new_date = [
                            d.getFullYear(),
                            ('0' + (d.getMonth() + 1)).slice(-2)
                        ].join('');
                        blindSpotResult[i]['month'] = new_date;

                    }
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({
                        'blind_spot_result': blindSpotResult,
                    });
                }
            } else {
                logger.error(`${PAGE_NAME} : No Parameter`);
                return res.status(400).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME} : `, err);
            return res.status(500).json('Error Occured');
        }
    },
    /**
    * userId에 일치하는 암점자가인식 검사 결과의 월 별 상세 정보 결과불러오는 함수
    * 
    * @method getResultGroupByMonthDetail
    * 
    */
    getResultGroupByMonthDetail: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_BLIND_SPOT_MONTH_DETAIL';

        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(user_id);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const blindSpotResult = await ResultService.BlindSpotCheck.selectGroupByMonthDetail(user_id);

                if (blindSpotResult === 1) {
                    logger.info(`${PAGE_NAME}: No Result`);
                    return res.status(204).json('No Result');
                } else if (blindSpotResult === -1) {
                    logger.error(`${PAGE_NAME}: Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    for (let i = 0; i < blindSpotResult.length; i++) {
                        let new_date;
                        let oldDate = blindSpotResult[i]['month'];
                        var d = new Date(oldDate);
                        new_date = [
                            d.getFullYear(),
                            ('0' + (d.getMonth() + 1)).slice(-2)
                        ].join('');
                        blindSpotResult[i]['month'] = new_date;

                    }
                    logger.info(`${PAGE_NAME}: success`);
                    return res.status(200).json({
                        'result_per_month_max_min': blindSpotResult
                    });
                }
            } else {
                logger.error(`${PAGE_NAME}: No Parameter`);
                return res.status(400).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME}: `, err);
            return res.status(500).json('Error Occured');
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
    * userID가 일치하는 안구이동검사 결과 불러오는 함수
    * 
    * @method getResultByUserId
    */
    getResultByUserId: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_EYE_MOVEMENT';

        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(user_id);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const eyeMovementResult = await ResultService.EyeMovementCheck.selectByUserId(user_id);

                if ((eyeMovementResult === 1)) {
                    logger.info(`${PAGE_NAME}: No Result`);
                    return res.status(204).json('No Result');
                } else if ((eyeMovementResult === -1)) {
                    logger.error(`${PAGE_NAME}: Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info(`${PAGE_NAME}: success`);
                    return res.status(200).json({ 'eye_movement_result': eyeMovementResult });
                }
            } else {
                logger.info(`${PAGE_NAME}: No Parameter`);
                return res.status(400).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME}: `, err);
            return res.status(500).json('Error Occured');
        }
    },

    /**
    * checkId가 일치하는 안구이동검사 결과 불러오는 함수
    * 
    * @method getResultByCheckId
    */
    getResultByCheckId: async (req, res) => {
        const PAGE_NAME = 'GET_EYEMOVEMENT_RESULT_DETAIL';
        try {
            if (req.params.check_em_id) {
                const check_em_id = req.params.check_em_id;

                const isExistedCheckId = await ResultService.VisionCheck.selectIsCheckedCheckId(check_em_id);

                if (isExistedCheckId === -1) {
                    logger.error(`${PAGE_NAME} : Do Not Found check ID`);
                    return res.status(404).json('Do Not Found check ID')
                }

                const eyeMovementRightResult = await ResultService.EyeMovementCheck.selectResultRightByCheckId(check_em_id);
                const eyeMovementLeftResult = await ResultService.EyeMovementCheck.selectResultLeftByCheckId(check_em_id);
                const eyeMovementResult = await ComputeResult.CompareResult(eyeMovementLeftResult, eyeMovementRightResult);

                if (eyeMovementResult === 1) {
                    logger.info(`${PAGE_NAME} : No Result`);
                    return res.status(204).json('No Result');
                } else if (eyeMovementResult === -1) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({
                        'eyeMovementResult': eyeMovementResult,
                    });
                }
            } else {
                logger.error(`${PAGE_NAME} : No Parameter`,);
                return res.status(400).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME} : `, err);
            return res.status(500).json('Error Occured');
        }
    },

    /**
     * userId에 일치하는 안구이동검사의 월 별 결과불러오는 함수
     * 
     * @method getResultGroupByMonth
     */
    getResultGroupByMonth: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_EYE_MOVEMENT_MONTH';

        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(user_id);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const eyeMovementResult = await ResultService.EyeMovementCheck.selectGroupByMonth(user_id);

                if (eyeMovementResult === 1) {
                    logger.info(`${PAGE_NAME}: No Result`);
                    return res.status(204).json(`No Result`);
                } else if (eyeMovementResult === -1) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    for (let i = 0; i < eyeMovementResult.length; i++) {
                        let new_date;
                        let oldDate = eyeMovementResult[i]['month'];
                        var d = new Date(oldDate);
                        new_date = [
                            d.getFullYear(),
                            ('0' + (d.getMonth() + 1)).slice(-2)
                        ].join('');
                        eyeMovementResult[i]['month'] = new_date;
                    }
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({
                        'eye_movement_result': eyeMovementResult,
                    });
                }
            } else {
                logger.error(`${PAGE_NAME}: No Parameter`);
                return res.status(400).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME}`, err);
            return res.status(500).json('Error Occured');
        }
    },

    /**
     * userId에 일치하는 안구이동검사의 월 별 상세 정보 결과불러오는 함수
     * 
     * @method getResultGroupByMonthDetail
     */
    getResultGroupByMonthDetail: async (req, res) => {
        const PAGE_NAME = 'GET_RESULT_EYE_MOVEMENT_MONTH_DETAIL';

        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(user_id);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const eyeMovementResult = await ResultService.EyeMovementCheck.selectGroupByMonthDetail(user_id);

                if (eyeMovementResult === 1) {
                    logger.info(`${PAGE_NAME} : No Result`);
                    return res.status(204).json('No Result');
                } else if (eyeMovementResult === 0) {
                    logger.error(`${PAGE_NAME} : Do Not Found User`);
                    return res.status(404).json('Do Not Found User');
                } else if (eyeMovementResult === -1) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info(`${PAGE_NAME} : success`);
                    for (let i = 0; i < eyeMovementResult.length; i++) {
                        let new_date;
                        let oldDate = eyeMovementResult[i]['month'];
                        var d = new Date(oldDate);
                        new_date = [
                            d.getFullYear(),
                            ('0' + (d.getMonth() + 1)).slice(-2)
                        ].join('');
                        eyeMovementResult[i]['month'] = new_date;
                    }
                    return res.status(200).json({
                        'result_per_month_max_min': eyeMovementResult
                    });
                }
            } else {
                logger.error(`${PAGE_NAME} : No Parameter`);
                return res.status(500).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME}`, err);
            return res.status(500).json('Error Occured');
        }
    }
}

/**
 * 통합검사 결과 모듈
 *
 *@module TotalResult 
 */

exports.TotalResult = {
    /**
 * userID가 일치하는 모든 검사 결과 불러오는 함수
 * 
 * @method getTotalResultByUserId
 */
    getTotalResultByUserId: async (req, res) => {
        const PAGE_NAME = 'GET TOTAL RESULT'

        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const isExistedUser = await UserService.SelectExistedUserId(user_id);

                if (isExistedUser === 0) {
                    logger.error(`${PAGE_NAME}: Do Not Found User ID`);
                    return res.status(404).json(`Do Not Found User ID`)
                }

                const totalLeftResult = await ResultService.TotalResult.selectLeftTotalByUserId(user_id);
                const totalRightResult = await ResultService.TotalResult.selectRightTotalByUserId(user_id);

                if ((totalLeftResult === -1) || (totalRightResult === -1)) {
                    logger.error(`${PAGE_NAME} : Bad Request`);
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info(`${PAGE_NAME} : success`);
                    return res.status(200).json({ totalLeftResult, totalRightResult });
                }
            } else {
                logger.error(`${PAGE_NAME} : No Parameter`);
                return res.status(500).json('No Parameter');
            }
        } catch (err) {
            logger.error(`${PAGE_NAME} : `, err);
            return res.status(500).json('Error Occured');
        }
    },
}


