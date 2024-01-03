/**
* 날짜형식변경 함수
* 
* @return {String} result_date
*/

exports.convertDate = async () => {
    // current date
    let dateNow = new Date();

    // adjust 0 before single digit date
    let day = ("0" + dateNow.getDate()).slice(-2);

    // current month
    let month = ("0" + (dateNow.getMonth() + 1)).slice(-2);

    // current year
    let year = dateNow.getFullYear().toString().substr(2);

    // current hours
    var hours = dateNow.getHours();
    hours = hours < 12 ? '0' + hours : hours;

    // current minutes
    var minutes = dateNow.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    var result_date = year + month + day + hours + minutes;
    return result_date;
}
