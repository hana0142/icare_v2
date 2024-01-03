// const morgan = require('morgan');
// var { StreamOptions } = require('morgan');
// const Logger = require('./logger');

// const stream = {
//     // Use the http severity
//     write: (message) => Logger.http(message),
// };

// // const stream = {
// //     write: message => { Logger.http(message) }
// // }

// // const skip = () => {
// //     const env = process.env.NODE_ENV || 'development';
// //     return env !== 'development';
// // }

// morgan.token("status", (req, res) => {
//     let color;

//     if (res.statusCode < 300) color = "\x1b[32m"    //green
//     else if (res.statusCode < 400) color = "\x1b[36m" //cyan
//     else if (res.statusCode < 500) color = "\x1b[33m"   //yellow
//     else if (res.statusCode < 600) color = "\x1b[31m"   //red
//     else color = "\x1b[0m" /*글자색 초기화*/

//     return color + res.statusCode + "\x1b[35m" /*보라색*/;
// });


// morgan.token("request", function (req, res) {
//     return "Request_" + JSON.stringify(req.body);
// });
// morgan.token("makeLine", function () {
//     let line = "---------응답 결과-----------------"
//     let blank = "                                   ";
//     return line + "\n" + blank;
// });

// // Build the morgan middleware
// // morgan 함수의 인자(format)로는 short, dev, common, combined 가 올 수 있다. (정보의 노출 수준)
// // 보통 배포시에는 combined 혹은 common 에 필요한 정보들을 추가하여 사용하는 것을 추천 || 추후 배포 시 사용 -> 주소,IP_ :remote-addr :remote-user |
// const morganMiddleware = morgan(
//     ":makeLine 요청_:method | url_':url' | :request | Status_:status | 응답시간_:response-time ms (:res[content-length]줄)",
//     { stream }
// );

// module.exports = morganMiddleware;


const morgan = require('morgan');
const logger = require('./logger.js');
const format = () => {
    return process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
};

// 로그 작성을 위한 Output stream옵션.
const stream = { write: (message) => logger.http(message) }
// 로깅 스킵 여부 (만일 배포환경이면, 코드가 400 미만라면 함수를 리턴해 버려서 로그 기록 안함. 코드가 400 이상이면 로그 기록함)
const skip = (_, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.ststusCode < 400;
    }
    return false;
};

const morganMiddleware = morgan(format(), { stream, skip });

module.exports = morganMiddleware;