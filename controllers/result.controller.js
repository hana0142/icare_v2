/**
 * version : 0.1
 * filename : result.controller.js
 * author : @Hana
 * comment : 결과 데이터 관련 컨트롤러
*/

const logger = require('../config/logger');
const ResultService = require('../services/result.service');

//시력검사 결과
exports.VisionCheck = {
    //user_id에 따른 결과 조회
    resultByUserId: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const visionResultByUserId = await ResultService.VisionCheck.selectByUserId(user_id);

                if ((visionResultByUserId === 1)) {
                    logger.info('No Contents');
                    return res.status(204).json('No Result');
                } else if ((visionResultByUserId === 0)) {
                    logger.error('Do Not Found User');
                    return res.status(404).json('Do Not Found');
                } else if ((visionResultByUserId === -1)) {
                    logger.error('Bad Request');
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info('userinfo');
                    return res.status(200).json({
                        'vision_result': visionResultByUserId
                    });
                }
            } else {
                logger.error('Bad Request');
                return res.status(400).send('Bad Request');
            }
        }
        catch (err) {
            logger.error('Internal Server Error message', { message: err });
            return res.status(500).json('Error Occured');
        }
    },

    //check_id에 따른 결과 조회
    resultByCheckId: async (req, res) => {
        try {
            if (req.params.check_id) {
                const check_id = req.params.check_id;
                const visionResultByCheckId = await ResultService.VisionCheck.selectByCheckId(check_id);

                if ((visionResultByCheckId === 1)) {
                    logger.info('No Contents');
                    return res.status(204).json('No Result');
                } else if ((visionResultByCheckId === 0)) {
                    logger.error('Do Not Found User');
                    return res.status(404).json('Do Not Found');
                } else if ((visionResultByCheckId === -1)) {
                    logger.error('Bad Request');
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info('userinfo');
                    return res.status(200).json({
                        'vision_result': visionResultByCheckId
                    });
                }
            } else {
                logger.error('Bad Request');
                return res.status(400).send('Bad Request');
            }
        }
        catch (err) {
            logger.error('Internal Server Error message', { message: err });
            return res.status(500).json('Error Occured');
        }
    },

    //월 별 결과 조회
    resultGroupByMonth: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const visionResultGroupByMonth = await ResultService.VisionCheck.selectGroupByMonth(user_id);

                if ((visionResultGroupByMonth === 1)) {
                    logger.info('No Contents');
                    return res.status(204).json('No Result');
                } else if ((visionResultGroupByMonth === 0)) {
                    logger.error('Do Not Found User');
                    return res.status(404).json('Do Not Found');
                } else if ((visionResultGroupByMonth === -1)) {
                    logger.error('Bad Request');
                    return res.status(400).json('Bad Request');
                } else {
                    for (let i = 0; i < visionResultGroupByMonth.length; i++) {
                        //날짜 추출
                        var result_month_date = new Date(visionResultGroupByMonth[i]['month']);
                        var result_year_num = result_month_date.getFullYear();
                        var result_month_num = result_month_date.getMonth() + 1;
                        var result_year_num = String(result_year_num);
                        var result_month_num = String(result_month_num);

                        visionResultGroupByMonth[i]['month'] = result_year_num.concat(result_month_num);
                    }
                    logger.info('success');
                    return res.status(200).json({
                        'result_per_month': visionResultGroupByMonth
                    });
                }
            } else {
                logger.error('Bad Request');
                return res.status(400).send('Bad Request');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    }
};

//암점자가인식 검사 결과
exports.BlindSpotCheck = {
    resultByUserId: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const blindSpotResult = await ResultService.BlindSpotCheck.selectByUserId(user_id);

                if ((blindSpotResult === 1)) {
                    logger.info('No Contents');
                    return res.status(204).json('No Result');
                } else if ((blindSpotResult === 0)) {
                    logger.error('Do Not Found User');
                    return res.status(404).json('Do Not Found');
                } else if ((blindSpotResult === -1)) {
                    logger.error('Bad Request');
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info('success');
                    return res.status(200).json({ 'blind_spot_result': blindSpotResult });
                }
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    },

    resultByCheckId: async (req, res) => {
        try {
            if (req.params.check_bs_id) {
                const check_bs_id = req.params.check_bs_id;
                const blindSpotRightResult = await ResultService.BlindSpotCheck.selectResultRightByCheckId(check_bs_id);
                const blindSpotLeftResult = await ResultService.BlindSpotCheck.selectResultLeftByCheckId(check_bs_id);
                const blindResult = await ResultService.BlindSpotCheck.compareResult(blindSpotLeftResult, blindSpotRightResult);

                if (blindResult === 1) {
                    logger.info('No Contents');
                    return res.status(204).json('No Result');
                } else if (blindResult === 0) {
                    logger.error('Do Not Found User');
                    return res.status(404).json('Do Not Found');
                } else if (blindResult === -1) {
                    logger.error('Bad Request');
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info('success');
                    return res.status(200).json({
                        'blind_spot_result': blindResult,
                    });
                }
            } else {
                logger.error('Bad Request');
                return res.status(400).json('Bad Request');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    },

    resultGroupByMonth: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const blindSpotResult = await ResultService.BlindSpotCheck.selectGroupByMonth(user_id);

                if (blindSpotResult === 1) {
                    logger.info('No Contents');
                    return res.status(204).json('No Result');
                } else if (blindSpotResult === 0) {
                    logger.error('Do Not Found User');
                    return res.status(404).json('Do Not Found');
                } else if (blindSpotResult === -1) {
                    logger.error('Bad Request');
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info('success');
                    return res.status(200).json({
                        'blind_spot_result': blindSpotResult,
                    });
                }
            } else {
                return res.status(400).json('Bad Request');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    },

    resultGroupByMonthDetail: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const blindSpotResult = await ResultService.BlindSpotCheck.selectGroupByMonthDetail(user_id);

                if (blindSpotResult === 1) {
                    logger.info('No Contents');
                    return res.status(204).json('No Result');
                } else if (blindSpotResult === 0) {
                    logger.error('Do Not Found User');
                    return res.status(404).json('Do Not Found');
                } else if (blindSpotResult === -1) {
                    logger.error('Bad Request');
                    return res.status(400).json('Bad Request');
                } else {
                    logger.info('success');
                    return res.status(200).json({
                        'result_per_month_max_min': blindSpotResult
                    });
                }
            } else {
                logger.error('Bad Request');
                return res.status(400).json('Bad Request');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    }
};

exports.EyeMovementCheck = {
    getResult: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                let vs_result = await ResultService.EyeMovementCheck.selectByUserId(user_id);

                if (vs_result != -1) {
                    // vs_result = JSON.stringify(vs_result);
                    // console.log(vs_result);
                    // console.log(JSON.stringify(vs_result));
                    return res.status(200).json({
                        'eye_movement_result': vs_result
                    });
                } else {
                    return res.status(404).json('Do Not Found');
                }
            }
            else {
                return res.status(400).json('Bad Request');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    },

    //get_result_check_em_id
    getResultDetail: async (req, res) => {
        try {
            if (req.params.check_em_id) {
                const check_em_id = req.params.check_em_id;
                const em_detail_result = await ResultService.EyeMovementCheck.selectByCheckId(check_em_id);

                if (em_detail_result != -1) {
                    console.log(em_detail_result);
                    return res.status(200).json({
                        'eye_movement_detail_result': em_detail_result
                    });
                }
                else {
                    return res.status(4 - 4).json('Do Not Found');
                }
            }
            else {
                return res.status(400).json('Bad Request');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    },

    getResultMonth: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const result_month = await ResultService.EyeMovementCheck.selectGroupByMonth(user_id);

                if (result_month != -1) {
                    console.log(result_month);
                    return res.status(200).json({
                        'result_per_month': result_month
                    });
                }
                else {
                    return res.status(404).json('Do Not Found');
                }
            }
            else {
                return res.status(400).json('Bad Request');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }
    },

    getResultMonthDetail: async (req, res) => {
        let data;
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                const result_month = await ResultService.EyeMovementCheck.selectGroupByMonthDetail(user_id);

                if (result_month != -1) {
                    console.log(result_month);
                    return res.status(200).json({
                        'result_per_month_max_min': result_month
                    });
                }
                else {
                    return res.status(400).json('fail');
                }
            }
            else {
                return res.status(404).json('do not find user_id');
            }
        } catch (err) {
            logger.error('Internal Server Error message');
            return res.status(500).json('Error Occured');
        }

    }
}


