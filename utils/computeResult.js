const logger = require("../config/logger");

/**
* DB 결과 데이터 비교 후 결과 또는 숫자 리턴_확인 여부
 * @param {Object} result DB 결과
 * @return {Object} 성공 DB 결과 데이터
 * @return {Number} 실패 0 또는 1 return
 */
const ReturnResult = async (result) => {
    let isExistedResult = -2;

    //결과 데이터 존재하는 경우 DB데이터 return
    if ((result) && (result.length !== 0)) {
        return result;
    } else if ((!result) || (result.length === 0)) {
        //조회는 되나 DB에 저장된 데이터가 없는 경우 1 return
        isExistedResult = 1;
        return isExistedResult;
    } else {
        //그 외 0 return
        isExistedResult = 0;
        return isExistedResult;
    }

}

/**
 * DB 결과 데이터 비교 후 결과 또는 숫자 리턴_확인 여부
 * @param {Object} result DB 결과
 * @return {Number} 성공 : 1 return, 실패 : 0 return
 */
const CheckResult = async (result) => {
    let isExistedResult = -2;

    //결과 데이터 존재하는 경우 DB데이터 return
    if ((result) && (result.length !== 0)) {
        isExistedResult = 1;
        return isExistedResult;
    } else {
        //그 외 0 return
        isExistedResult = 0;
        return isExistedResult;
    }
}

/**
 * 좌안, 우안 결과 비교 
 * @param {Object} leftResult 좌안 결과
 * @param {Object} rightResult 우안 결과
 * @return {Number} 성공 : 1 return, 실패 : 0 return
 * @return {Number} 성공 : 1 return, 실패 : 0 return
 */
const CompareResult = async (leftResult, rightResult) => {
    let returnResult;

    try {
        if ((leftResult === 1) || (rightResult === 1)) {
            returnResult = 1;
            return returnResult;
        } else if ((leftResult === 0) || (rightResult === 0)) {
            returnResult = 0;
            return returnResult;
        } else if ((leftResult === -1) || (rightResult === -1)) {
            returnResult = -1;
            return returnResult;
        } else {
            // returnResult['left_detail_result'] = [leftResult, rightResult];
            returnResult = {};
            returnResult['left_detail_result'] = leftResult;
            returnResult['right_detail_result'] = rightResult;
            // console.log(returnResult);
            return returnResult;
        }
    } catch (err) {
        logger.error('compare result error');
        return err;
    }
}

module.exports = { ReturnResult, CheckResult, CompareResult };