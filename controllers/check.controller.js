
const getDate = require('../middlewares/getDate');
const CheckService = require('../services/check.service');

//시력검사
exports.Vision = {
    //시력검사 시작시 GET
    getCheck: async (req, res) => {
        try {
            if ((req.params.user_id)) {
                const user_id = req.params.user_id;
                let dateNow = await getDate.convertDate();
                let check_vs_no = 'vs_' + String(dateNow) + user_id;

                //성공(200)
                return res.status(200).json({
                    'check_id': check_vs_no
                });
            }

            //params에 user_id 없음
            else {
                return res.status(400).json('Bad Request');
            }

            //그 외 모든 오류
        } catch (err) {
            console.log(err);
            return res.status(500).json('Internal Server Error Occured');
        }
    },

    //시력검사 완료 후 POST
    postCheck: async (req, res) => {
        try {
            if (req.body.check_id) {
                const actoken = req.headers.authorization;
                const check_vs_no = req.body.check_id;
                const user_id = req.params.user_id;
                const check_corrected = req.body.check_corrected;
                const right_result = req.body.right_result;
                const left_result = req.body.left_result;
                const send_vs_result = await CheckService.VisionCheck.insertVisionResult(check_vs_no, user_id, right_result, left_result, check_corrected);
                const send_vs_check_info = await CheckService.CheckInfo.insertCheckResult('vs', check_vs_no, user_id)

                if (send_vs_result != -1) {
                    return res.status(200).json({
                        'right_result': right_result,
                        'left_result': left_result
                    });
                }
                else {
                    return res.status(400).json('fail');
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('server error');
        }
    }
}

//암점자가인식검사
exports.BlindSpot = {
    //암점자가인식검사 시작시 GET
    getCheck: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                var dateNow = new Date();
                const date = await getDate.convertDate(dateNow);
                let check_bs_no = 'bs_' + String(date) + user_id;

                //성공(200)
                return res.status(200).json({
                    'check_id': check_bs_no
                });
            }
            //params에 user_id 없음
            else {
                return res.status(400).json('Bad Request');
            }
            //그 외 모든 오류
        } catch (err) {
            console.log(err);
            return res.status(500).json('fail');
        }
    },

    //암점자가인식검사 검사 POST
    postCheck: async (req, res) => {
        try {
            if (req.body.check_bs_id) {
                //전체 검사 결과
                const check_bs_id = req.body.check_bs_id;
                const user_id = req.params.user_id;

                //우안 검사 
                const bs_right_vfi = req.body.bs_right_vfi;
                const bs_right_spot_point = req.body.bs_right_spot_point;

                //좌안 검사
                const bs_left_vfi = req.body.bs_left_vfi;
                const bs_left_spot_point = req.body.bs_left_spot_point;
                const check_category = 'bs';
                // 검사 결과 보내기
                const bs_result
                    = await CheckService.BlindSpotCheck.insertBlindResult(check_category, check_bs_id, user_id, bs_right_vfi, bs_left_vfi, bs_right_spot_point, bs_left_spot_point);


                if (bs_result != -1) {
                    return res.status(200).json('success');
                }
                else {
                    return res.status(400).json('fail');
                }
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('server error');
        }
    }
}

//안구이동검사
exports.EyeMovement = {
    //안구이동검사 시작시 GET
    getCheck: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                var dateNow = new Date();
                const date = await getDate.convertDate(dateNow);
                let check_id = 'em_' + String(date) + user_id;

                // res.cookie('check_no', check_id);
                return res.status(200).json({
                    'check_id': check_id
                });
            }
            else {
                return res.status(400).json('fail');
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('fail');
        }
    },

    //안구이동검사 결과 POST
    postCheck: async (req, res) => {
        // check_category, check_id, user_id
        try {
            if (req.body.check_em_id) {
                const check_em_id = req.body.check_em_id;
                const user_id = req.params.user_id;
                const right_vfi = req.body.right_vfi;
                const left_vfi = req.body.left_vfi;
                const right_location = req.body.right_location;
                const left_location = req.body.left_location;
                const check_result = await CheckService.CheckInfo.insertCheckResult('em', check_em_id, user_id);
                console.log(check_result);
                const result_em_check = await CheckService.EyeMovementCheck.insert_em_result(check_em_id, user_id, right_vfi, left_vfi);
                console.log(result_em_check);
                const insert_em_right_result = await CheckService.EyeMovementCheck.insert_em_right_result(check_em_id, user_id, right_location);
                console.log(insert_em_right_result);

                const insert_em_left_result = await CheckService.EyeMovementCheck.insert_em_left_result(check_em_id, user_id, left_location);

                if ((result_em_check != -1) && (insert_em_right_result != -1) && (insert_em_left_result != -1)) {
                    return res.status(200).json('success');
                }
                else {
                    return res.status(400).json('fail');
                }
            }
            // 
        } catch (err) {
            console.log(err);
            return res.status(500).json('server error');
        }
    },

    // exports.Check = {
    //     //시력 교정 여부 체크_클라이언트에서 저장 후 검사 결과 보낼 때 같이 전송
    //     checkStart: async (req, res) => {
    //         if (req.body.corrected) {
    //             const check_corrected = req.body.corrected;
    //             console.log(check_corrected);
    //             return res.redirect('/api/check/vision');
    //         }
    //         else {
    //             console.log('fail');
    //             return res.status(400).json('fail');
    //         }
    //     }
    // }

    //암점자가인식검사 검사 POST
    // //검사_좌우_기타
    // postCheck: async (req, res) => {
    //     try {
    //         if (req.params.check_bs_no) {
    //             const check_bs_no = req.params.check_bs_no;
    //             const user_id = req.params.user_id;

    //             //우안 검사 
    //             const bs_right_vfi = req.body.bs_right_vfi;
    //             const bs_right_location_t = req.body.bs_right_location_t;
    //             const bs_right_location_st = req.body.bs_right_location_st;
    //             const bs_right_location_it = req.body.bs_right_location_it;
    //             const bs_right_location_sn = req.body.bs_right_location_sn;
    //             const bs_right_location_in = req.body.bs_right_location_in;

    //             //우안 검사 결과 보내기
    //             const bs_right_result
    //                 = await CheckService.BlindSpotCheck.insert_blind_spot_right(
    //                     check_bs_no, user_id, bs_right_vfi, bs_right_location_t, bs_right_location_in, bs_right_location_it, bs_right_location_sn, bs_right_location_st);

    //             //좌안 검사
    //             const bs_left_vfi = req.body.bs_left_vfi;
    //             const bs_left_location_t = req.body.bs_left_location_t;
    //             const bs_left_location_st = req.body.bs_left_location_st;
    //             const bs_left_location_it = req.body.bs_left_location_it;
    //             const bs_left_location_sn = req.body.bs_left_location_sn;
    //             const bs_left_location_in = req.body.bs_left_location_in;

    //             //좌안 검사 결과 보내기
    //             const bs_left_result
    //                 = await CheckService.BlindSpotCheck.insert_blind_spot_left(
    //                     check_bs_no, user_id, bs_left_vfi, bs_left_location_t, bs_left_location_st, bs_left_location_it, bs_left_location_sn, bs_left_location_in);

    //             if ((bs_right_result != -1) && (bs_left_result != -1)) {
    //                 return res.status(200).json('success');
    //             }
    //             else {
    //                 return res.status(400).json('fail');
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         return res.status(500).json('server error');
    //     }
    // }
}


