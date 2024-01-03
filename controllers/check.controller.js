/**
 * version  : 0.1
 * filename : check.controller.js
 * author   : @Hana
 * comment  : 검사 관련 컨트롤러 기능 구현(라우터에 연결)
 */
const logger = require('../config/logger');
const getDate = require('../utils/getDate');
const UserService = require('../services/user.service');
const CheckService = require('../services/check.service');

//#region 
/**
 * 시력검사 관련 모듈
 * 
 * @module VisionCheck
*/
exports.VisionCheck = {
    /**
     * 시력검사 완료 후 결과 데이터 DB에 전송하는 함수
     * 
     * @method postCheckResult
     */
    postCheckResult: async (req, res) => {
        try {
            if (req.params.user_id) {
                let visionCheckId;
                const userId = req.params.user_id;
                const isCheckedUser = await UserService.SelectExistedUserId(userId);

                if (isCheckedUser === 1) {
                    const dateNow = await getDate.convertDate();
                    visionCheckId = 'vs_' + String(dateNow) + userId;
                } else {
                    logger.error('GET_CHECK_VISION : Do Not Found User ID');
                    return res.status(404).json('Do Not Found User ID');
                }

                const isCorrected = req.body.check_corrected;
                const leftVisionResult = req.body.left_result;
                const rightVisionResult = req.body.right_result;
                const visionResult = await CheckService.VisionCheck.insertResult(visionCheckId, userId, leftVisionResult, rightVisionResult, isCorrected);

                if (visionResult === 0) {
                    logger.info('POST_CHECK_VISION : success insert DB');
                    return res.status(201).json('success');
                } else if (visionResult === -1) {
                    logger.error('POST_CHECK_VISION : DB ROLLBACK')
                    return res.status(400).json('DB ROLLBACK');
                }
                else {
                    logger.info('POST_CHECK_VISION : INTERNAL DB SERVER ERROR OCCURED',);
                    return res.status(500).json('Error Occured');
                }
            } else {
                logger.error('POST_CHECK_VISION : No parameter');
                return res.status(400).json('No parameter')
            }
        } catch (err) {
            logger.error('POST_CHECK_VISION', err);
            return res.status(500).json('POST_CHECK_VISION : Error Occured');
        }
    }
}
//#endregion

//#region 
/**
 * 암점자가인식검사 관련 모듈
 * 
 * @module BlindSpotCheck
*/
exports.BlindSpotCheck = {
    /**
     * 암점자가인식 검사 고유 번호 CheckId 생성 함수
     * 
     * @method getCheckId
     */
    getCheckId: async (req, res) => {
        try {
            if (req.params.user_id) {
                const dateNow = new Date();
                const userId = req.params.user_id;
                const date = await getDate.convertDate(dateNow);
                const checkBsId = 'bs_' + String(date) + userId;

                logger.info('GET_CHECK_BLIND_SPOT : success get blind spot checkId');

                return res.status(200).json({
                    'check_id': checkBsId
                });
            } else {
                logger.error('GET_CHECK_BLIND_SPOT : no user_id')
                return res.status(400).json('Bad Request');
            }
        } catch (err) {
            logger.error('GET_CHECK_BLIND_SPOT', err);
            return res.status(500).json('Error Occured');
        }
    },

    /**
     * 암점자가인식 검사 완료 후 결과 데이터 DB에 전송하는 함수
     * 
     * @method postCheckResult
     */
    postCheckResult: async (req, res) => {
        try {
            if (req.params.user_id) {
                let blindSpotCheckId;
                const userId = req.params.user_id;
                const isCheckedUser = await UserService.SelectExistedUserId(userId);

                if (isCheckedUser === 1) {
                    const dateNow = await getDate.convertDate();
                    blindSpotCheckId = 'bs_' + String(dateNow) + userId;
                } else {
                    logger.error('POST_BLIND_SPOT_CHECK : Do Not Found User ID');
                    return res.status(404).json('POST_BLIND_SPOT_CHECK : Do Not Found User ID');
                }

                logger.info('POST_BLIND_SPOT_CHECK : success get blind spot checkId');

                //좌안 검사
                const blindSpotLeftVFI = req.body.bs_left_vfi;
                const blindSpotLeftPoint = req.body.bs_left_spot_point;
                const blindSpotLeftLocation = req.body.bs_left_location;
                //우안 검사
                const blindSpotRightVFI = req.body.bs_right_vfi;
                const blindSpotRightPoint = req.body.bs_right_spot_point;
                const blindSpotRightLocation = req.body.bs_right_location;

                const blindSpotLeftResults = [blindSpotLeftVFI, blindSpotLeftPoint, blindSpotLeftLocation];
                const blindSpotRightResults = [blindSpotRightVFI, blindSpotRightPoint, blindSpotRightLocation];
                const blindSpotResult
                    = await CheckService.BlindSpotCheck.insertResult(blindSpotCheckId, userId, blindSpotLeftResults, blindSpotRightResults);

                if (blindSpotResult === 0) {
                    logger.info('POST_CHECK_BLIND_SPOT : success insert DB');

                    return res.status(201).json('POST_CHECK_BLIND_SPOT : success insert DB');
                } else if (blindSpotResult === -1) {
                    logger.error('POST_CHECK_BLIND_SPOT : FAIL_DB ROLLBACK')

                    return res.status(400).json('POST_CHECK_BLIND_SPOT : DB ROLLBACK');
                } else {
                    logger.error('POST_CHECK_BLIND_SPOT : INTERNAL DB SERVER ERROR OCCURED');

                    return res.status(500).json('POST_CHECK_BLIND_SPOT : Error Occured');
                }
            } else {
                logger.error('POST_BLIND_SPOT_RESULT : NO PARAMETER');

                return res.status(400).json('POST_BLIND_SPOT_RESULT : NO PARAMETER');
            }
        }
        catch (err) {
            logger.error('POST_CHECK_BLIND_SPOT', err);
            return res.status(500).json('POST_CHECK_BLIND_SPOT : Error Occured');
        }
    }
}
//#endregion

//#region
/**
 * 안구이동검사 관련 모듈
 * 
 * @module EyeMovementCheck
*/
exports.EyeMovementCheck = {
    /**
     * 안구이동검사 고유 번호 CheckId 생성 함수
     * 
     * @method getCheckId
     */
    getCheckId: async (req, res) => {
        try {
            if (req.params.user_id) {
                const dateNow = new Date();
                const userId = req.params.user_id;
                const date = await getDate.convertDate(dateNow);
                const checkEmId = 'em_' + String(date) + userId;

                logger.info('GET_CHECK_EYE_MOVEMENT : success get eye movement checkId');
                return res.status(200).json({
                    'check_id': checkEmId
                });
            } else {
                logger.error('GET_CHECK_EYE_MOVEMENT : fail')
                return res.status(400).json('fail');
            }
        } catch (err) {
            logger.error('GET_CHECK_EYE_MOVEMENT', err);
            return res.status(500).json('Error Occured');
        }
    },
    /**
     * 안구이동검사 완료 후 결과 데이터 DB에 전송하는 함수
     * 
     * @method postCheckResult
     */
    postCheckResult: async (req, res) => {
        try {
            if (req.params.user_id) {
                let eyeMovementCheckId;
                const userId = req.params.user_id;
                const isCheckedUser = await UserService.SelectExistedUserId(userId);

                if (isCheckedUser === 1) {
                    const dateNow = await getDate.convertDate();
                    eyeMovementCheckId = 'em_' + String(dateNow) + userId;
                } else {
                    logger.error('POST_CHECK_EYE_MOVEMENT : Do Not Found User ID');

                    return res.status(404).json('POST_CHECK_EYE_MOVEMENT : Do Not Found User ID');
                }
                logger.info('POST_CHECK_EYE_MOVEMENT : success get eye movement checkId');

                const eyeMovementLeftVFI = req.body.left_vfi;
                const eyeMovementRightVFI = req.body.right_vfi;
                const eyeMovementLeftLocation = req.body.left_location;
                const eyeMovementRightLocation = req.body.right_location;
                const eyeMovementLeftResult = [eyeMovementLeftVFI, eyeMovementLeftLocation];
                const eyeMovementRightResult = [eyeMovementRightVFI, eyeMovementRightLocation];

                const eyeMovementResult
                    = await CheckService.EyeMovementCheck.insertResult(eyeMovementCheckId, userId, eyeMovementLeftResult, eyeMovementRightResult);
                // console.log(eyeMovementResult);
                if (eyeMovementResult === 0) {
                    logger.info('POST_CHECK_EYE_MOVEMENT : success insert DB');

                    return res.status(201).json('POST_CHECK_EYE_MOVEMENT : success');
                } else if (eyeMovementResult === -1) {
                    logger.error('POST_CHECK_BLIND_SPOT : FAIL_DB ROLLBACK')

                    return res.status(400).json('fail');
                } else {
                    logger.error('POST_CHECK_EYE_MOVEMENT : INTERNAL DB SERVER ERROR OCCURED');

                    return res.status(500).json('POST_CHECK_EYE_MOVEMENT : INTERNAL DB SERVER ERROR OCCURED');
                }
            }
        } catch (err) {
            logger.error('POST_CHECK_EYE_MOVEMENT', err);

            return res.status(500).json('POST_CHECK_EYE_MOVEMENT : Error Occured');
        }
    }
}
//#endregion


