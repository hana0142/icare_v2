const ResultService = require('../services/result.service');

//시력검사 결과
exports.VisionCheck = {
    //결과 조회
    getResult: async (req, res) => {

        try {
            //파라미터 user_id가 있는 경우
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                //user_id를 조건으로 시력검사 결과 조회
                const vs_result = await ResultService.VisionCheck.selectResultByUserId(user_id);

                if (vs_result != -1) {
                    return res.status(200).json({
                        'vision_result': vs_result
                    });
                }
            }
            //파라미터가 주어지지 않은 경우
            else {
                return res.status(400).send('Bad Request');
            }
        }
        //서버 오류
        catch (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error occured');
        }
    },

    //시력검사 상세 결과 조회
    getResultDetail: async (req, res) => {
        try {
            //파라미터 검사아이디가 있는 경우
            if (req.params.check_id) {
                const check_id = req.params.check_id;
                //DB에서 시력검사 상세 결과 조회
                const vs_detail_result = await ResultService.VisionCheck.selectResultByCheckId(check_id);

                //
                if (vs_detail_result != -1) {
                    return res.status(200).json({
                        'vision_detail_result': vs_detail_result
                    });
                }
            }
            //검사 아이디가 없는 경우
            else {
                return res.status(400).send('Bad Request');
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('fail');
        }
    },

    getResultMonth: async (req, res) => {
        if (req.params.user_id) {
            const user_id = req.params.user_id;
            const result_month = await ResultService.VisionCheck.selectVisionResultGroupByMonth(user_id);


            for (let i = 0; i < result_month.length; i++) {
                //날짜 추출
                var result_month_date = new Date(result_month[i]['month']);
                var result_year_num = result_month_date.getFullYear();
                var result_month_num = result_month_date.getMonth() + 1;
                var result_year_num = String(result_year_num);
                var result_month_num = String(result_month_num);
                console.log(result_year_num);
                console.log(result_month_num);

                result_month[i]['month'] = result_year_num.concat(result_month_num);
                // console.log()

                //문자열로 변환
                // let temp;
                // temp = String(result_month[i]['month']);
                // console.log(temp);
                // //데이터 객체 생성
                // // temp = new Date();
                // get_month = temp.getUTCMonth() + 1;
                // result_month[i]['month'] = get_month;
                // console.log(get_month)
            }
            if (result_month != -1) {
                return res.status(200).json({
                    'result_per_month': result_month
                });
            }
            else {
                return res.status(400).json('fail');
            }
        }
        else {
            return res.status(404).json('do not find user_id');
        }
    }
};

exports.BlindSpotCheck = {
    getResult: async (req, res) => {
        try {
            if (req.cookies.user_id) {
                const user_id = req.cookies.user_id;
                let vs_result = await ResultService.BlindSpotCheck.get_result_user_id(user_id);

                if (vs_result != -1) {
                    // vs_result = JSON.stringify(vs_result);
                    console.log(vs_result);
                    // console.log(JSON.stringify(vs_result));
                    return res.status(200).json({ 'blind_spot_result': vs_result });
                }
            }
            else {
                return res.status(400).json('fail');
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('fail');
        }
    },

    getResultDetail: async (req, res) => {
        try {
            if (req.params.check_bs_id) {
                const check_bs_id = req.params.check_bs_id;
                const bs_detail_result = await ResultService.BlindSpotCheck.get_result_check_no(check_bs_id);

                if (bs_detail_result != -1) {
                    console.log(bs_detail_result);
                    return res.status(200).json({
                        'blind_spot_detail_result': bs_detail_result
                    });
                }
            }
            else {
                return res.status(400).json('fail');
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('fail');
        }
    },

    getResultMonth: async (req, res) => {
        let data;

        if (req.params.user_id) {
            const user_id = req.params.user_id;
            const result_month = await ResultService.BlindSpotCheck.get_result_by_month(user_id);

            if (result_month != -1) {
                console.log(result_month);
                return res.status(200).json({
                    'result_per_month': result_month
                });
            }
            else {
                return res.status(400).json('fail');
            }
        }
        else {
            return res.status(404).json('do not find user_id');
        }
    },
    getResultMonthDetail: async (req, res) => {
        let data;

        if (req.params.user_id) {
            const user_id = req.params.user_id;
            const result_month = await ResultService.BlindSpotCheck.get_result_by_month_detail(user_id);

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
    },

};

exports.EyeMovementCheck = {
    getResult: async (req, res) => {
        try {
            if (req.params.user_id) {
                const user_id = req.params.user_id;
                let vs_result = await ResultService.EyeMovementCheck.get_result_user_id(user_id);

                if (vs_result != -1) {
                    // vs_result = JSON.stringify(vs_result);
                    console.log(vs_result);
                    // console.log(JSON.stringify(vs_result));
                    return res.status(200).json({
                        'eye_movement_result': vs_result
                    });
                }
            }
            else {
                return res.status(400).json('fail');
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('fail');
        }
    },

    //get_result_check_em_id
    getResultDetail: async (req, res) => {
        try {
            if (req.params.check_em_id) {
                const check_em_id = req.params.check_em_id;
                const em_detail_result = await ResultService.EyeMovementCheck.get_result_check_em_id(check_em_id);
                console.log(em_detail_result);

                if (em_detail_result != -1) {
                    console.log(em_detail_result);
                    return res.status(200).json({
                        'eye_movement_detail_result': em_detail_result
                    });
                }
            }
            else {
                return res.status(400).json('fail');
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json('fail');
        }
    },

    getResultMonth: async (req, res) => {
        let data;

        if (req.params.user_id) {
            const user_id = req.params.user_id;
            const result_month = await ResultService.EyeMovementCheck.get_result_by_month(user_id);

            if (result_month != -1) {
                console.log(result_month);
                return res.status(200).json({
                    'result_per_month': result_month
                });
            }
            else {
                return res.status(400).json('fail');
            }
        }
        else {
            return res.status(404).json('do not find user_id');
        }
    },
    getResultMonthDetail: async (req, res) => {
        let data;

        if (req.params.user_id) {
            const user_id = req.params.user_id;
            const result_month = await ResultService.EyeMovementCheck.get_result_by_month_detail(user_id);

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
    },

}


