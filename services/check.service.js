const { sequelize } = require('../models');
const Check_info = require('../models').check_info;
const Vision_result = require('../models').vision_result;
const Blind_spot_result = require('../models').blind_spot_result;
const Blind_spot_left_result = require('../models').blind_spot_left_result;
const Blind_spot_right_result = require('../models').blind_spot_right_result;
const Eye_movement_result = require('../models').eye_movement_result;
const Eye_movement_left_result = require('../models').eye_movement_left_result;
const Eye_movement_right_result = require('../models').eye_movement_right_result;

exports.CheckInfo = {
    /**
     * 검사 정보 insert
     * 
     * @param {String} check_category
     * @param {String} check_id
     * @param {String} user_id
     * @return {Number} isExistedResult
    */
    insertCheckResult: async (check_category, check_id, user_id) => {
        let isExistedResult = -2;
        const created_date = Date.now();

        try {
            const createCheckInfo = await Check_info.create({
                user_id: user_id,
                check_id: check_id,
                created_date: created_date,
                check_category: check_category
            }).then((result) => {
                isExistedResult = 0;
                return isExistedResult;
            }).catch((err) => {
                isExistedResult = -1;
                console.log(err);
                return isExistedResult;
            });

        } catch (err) {
            return_result = -1;
            console.log(err);
            return return_result;
        }
    }
}

exports.VisionCheck = {
    /**
     * 시력검사결과 insert
     * 
     * @param {String} check_no
     * @param {String} user_id
     * @param {Number} right_result
     * @param {Number} left_result
     * @param {Boolean} check_corrected
     * @return {Number} isExistedResult
    */
    insertVisionResult: async (check_no, user_id, right_result, left_result, check_corrected) => {
        let isExistedResult = -2;
        const created_date = Date.now();

        try {
            const createVision = await Vision_result.create({
                user_id: user_id,
                check_id: check_no,
                left_eye_result: left_result,
                right_eye_result: right_result,
                created_date: created_date,
                check_corrected: check_corrected
            }).then((result) => {
                isExistedResult = 0;
                return isExistedResult;
            }).catch((err) => {
                console.log(err);
                isExistedResult = -1;
                return isExistedResult;
            });
        } catch (err) {
            console.log(err);
            isExistedResult = -1;
            return isExistedResult;
        }
    }
}

exports.BlindSpotCheck = {

    /**
     * 암점 자가인식 검사 정보 insert
     * 
     * @param {String} check_category
     * @param {String} check_bs_id
     * @param {String} user_id
     * @param {Number} bs_right_vfi
     * @param {Number} bs_left_vfi
     * @param {Array} bs_right_spot_point
     * @param {Array} bs_left_spot_point
     * @return {Number} isExistedResult
    */
    insertBlindResult: async (check_category, check_bs_id, user_id, bs_right_vfi, bs_left_vfi, bs_right_spot_point, bs_left_spot_point) => {
        const t = await sequelize.transaction();
        let isExistedResult = -2;
        const created_date = Date.now();

        try {
            const createCheckInfo = await Check_info.create({
                check_id: check_bs_id,
                user_id: user_id,
                check_category: check_category,
                created_date: created_date,
                transaction: t
            });

            const createBlindSpotResult = await Blind_spot_result.create({
                check_id: check_bs_id,
                user_id: user_id,
                left_vfi: bs_left_vfi,
                right_vfi: bs_right_vfi,
                created_date: created_date,
                transaction: t
            });
            const createBlindSpotResultLeft = await Blind_spot_left_result.create({
                check_id: check_bs_id,
                user_id: user_id,
                blind_spot_point: bs_left_spot_point,
                created_date: created_date,
                transaction: t
            });
            const createBlindSpotResultRight = await Blind_spot_right_result.create({
                check_id: check_bs_id,
                user_id: user_id,
                blind_spot_point: bs_right_spot_point,
                created_date: created_date,
                transaction: t
            });

            await t.commit();
            isExistedResult = 0;
            return isExistedResult;

        } catch (err) {
            await t.rollback();
            console.log(err);
            isExistedResult = -1;
            return isExistedResult
        }
    },
    // insert_blind_spot_left: async () => {
    //     var return_result = -1;
    //     // var dateNow = new Date();
    //     const created_date = Date.now();
    //     console.log(created_date);

    //     try {
    //         const insert_bs_left_result = await Blind_spot_left_result.create({
    //             user_id: user_id,
    //             check_id: check_no,
    //             left_eye_result: left_result,
    //             created_date: created_date,
    //         }).then((result) => {
    //             return_result = 0;
    //             return return_result;
    //         });

    //         const insert_bs_left_result_location = await Blind_spot_left_detail_result.create({
    //             user_id: user_id,
    //             check_id: check_no,
    //             created_date: created_date,
    //             // check_corrected
    //         })
    //     } catch (err) {
    //         console.log(err);
    //         return return_result;
    //     }


    // try {
    //     const resultPost = await Post.create(post, { transaction: t })
    //     const resultPostResources = await PostResources.create({
    //         PostId: resultPost.id,
    //         name: req.body.title,
    //         url: req.body.url,
    //     }, { transaction: t })
    //     await t.commit();
    //     res.status(200).json(result)
    // } catch (error) {
    //     console.log(error || 'Error occured in transaction');
    // }
    // },

    // insert_blind_spot_right: async (check_bs_no, user_id, bs_right_spot_point) => {
    //     var return_result = -1;
    //     // var dateNow = new Date();
    //     const created_date = Date.now();

    //     try {
    //         const insert_bs_right_result = await Blind_spot_right_result.create({
    //             user_id: user_id,
    //             check_id: check_bs_no,
    //             vfi: bs_right_vfi,
    //             created_date: created_date
    //         });

    //         const insert_bs_right_location_result = await Blind_spot_right_detail_result.create({
    //             user_id: user_id,
    //             check_id: check_bs_no,
    //             location_t: bs_right_location_t,
    //             location_st: bs_right_location_st,
    //             location_in: bs_right_location_in,
    //             location_sn: bs_right_location_sn,
    //             location_it: bs_right_location_it,
    //             created_date: created_date,
    //             // check_corrected: check_corrected
    //         });
    //         return_result = 0;
    //         return return_result;

    //     } catch (err) {
    //         console.log(err);
    //         return return_result;
    //     }
    // }
}

exports.EyeMovementCheck = {
    /**
 * 검사 정보 insert
 * 
 * @param {String} check_category
 * @param {String} check_id
 * @param {String} user_id
 * @return {Number} isExistedResult
*/
    insert_em_result: async (check_em_id, user_id, right_vfi, left_vfi) => {
        var return_result = -1;
        const created_date = Date.now();

        try {
            const insert_eyemovement_result = await Eye_movement_result.create({
                check_id: check_em_id,
                user_id: user_id,
                left_vfi: left_vfi,
                right_vfi: right_vfi,
                created_date: created_date
            });

        } catch (err) {
            console.log;
            return return_result;
        }
    },
    /**
 * 검사 정보 insert
 * 
 * @param {String} check_category
 * @param {String} check_id
 * @param {String} user_id
 * @return {Number} isExistedResult
*/
    insert_em_right_result: async (check_em_id, user_id, right_location) => {
        var return_result = -1;
        // var dateNow = new Date();
        const created_date = Date.now();

        try {
            const insert_em_right_result = await Eye_movement_right_result.create({
                user_id: user_id,
                check_id: check_em_id,
                location_t: right_location[1],
                location_st: right_location[3],
                location_in: right_location[5],
                location_sn: right_location[7],
                location_it: right_location[9],
                created_date: created_date,
            });
        } catch (err) {
            console.log(err);
            return return_result;
        }

    },
    /**
 * 검사 정보 insert
 * 
 * @param {String} check_category
 * @param {String} check_id
 * @param {String} user_id
 * @return {Number} isExistedResult
*/
    insert_em_left_result: async (check_em_id, user_id, left_location) => {
        var return_result = -1;
        // var dateNow = new Date();
        const created_date = Date.now();

        try {
            const insert_em_left_result = await Eye_movement_left_result.create({
                user_id: user_id,
                check_id: check_em_id,
                location_t: left_location[1],
                location_st: left_location[3],
                location_in: left_location[5],
                location_sn: left_location[7],
                location_it: left_location[9],
                created_date: created_date,
            });
        } catch (err) {
            console.log(err);
            return return_result;
        }
    }
}