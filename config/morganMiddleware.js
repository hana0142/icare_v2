const morgan = require('morgan');
const Logger = require('./logger');

const stream = {
    write: message => { Logger.http(message) }
}

const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
}

morgan.token("status", (req, res) => {
    let color;

    if (res.statusCode < 300) color = "\x1b[32m"    //green
    else if (res.statusCode < 400) color = "\x1b[36m" //cyan
    else if (res.statusCode < 500) color = "\x1b[33m"   //yellow
    else if (res.statusCode < 600) color = "\x1b[31m"   //red
    else color = "\x1b[0m" /*글자색 초기화*/

    return color + res.statusCode + "\x1b[35m" /*보라색*/;
});

// https://jeonghwan-kim.github.io/morgan-helper/
morgan.token("request", function (req, res) {
    return "Request_" + JSON.stringify(req.body);
});
morgan.token("makeLine", function () {
    let line = "-----------------------------------------------*(੭*ˊᵕˋ)੭* 응답 결과 ╰(*'v'*)╯-----------------------------------------------"
    let blank = "                                   ";
    return line + "\n" + blank;
});

// Build the morgan middleware
// morgan 함수의 인자(format)로는 short, dev, common, combined 가 올 수 있다. (정보의 노출 수준)
// 보통 배포시에는 combined 혹은 common 에 필요한 정보들을 추가하여 사용하는 것을 추천 || 추후 배포 시 사용 -> 주소,IP_ :remote-addr :remote-user |
const morganMiddleware = morgan(
    ":makeLine 요청_:method | url_':url' | :request | Status_:status | 응답시간_:response-time ms (:res[content-length]줄)",
    { stream, skip }
);

module.exports = morganMiddleware;