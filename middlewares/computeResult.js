const ReturnResult = async (result) => {
    let isExistedResult = -2;

    //결과 데이터 존재하는 경우 DB데이터 return
    if ((result) && (result.length !== 0)) {
        return result;
    } else if (result.length === 0) {
        //조회는 되나 DB에 저장된 데이터가 없는 경우 1 return
        isExistedResult = 1;
        return isExistedResult;
    } else {
        //그 외 0 return
        isExistedResult = 0;
        return isExistedResult;
    }

}

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



module.exports = { ReturnResult, CheckResult };