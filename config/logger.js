// const appRoot = require("app-root-path");
// const winston = require("winston");

// // define the custom settings for each transport (file, console)
// const options = {
//     file: {
//         level: "info",
//         filename: `${appRoot}/logs/app.log`,
//         handleExceptions: true,
//         maxsize: 5242880, // 5MB
//         maxFiles: 5,
//         format: winston.format.combine(
//             winston.format.timestamp(),
//             winston.format.json()
//         ),
//     },
//     console: {
//         level: "error",
//         handleExceptions: true,
//         format: winston.format.combine(
//             winston.format.colorize(),
//             winston.format.simple()
//         ),
//     },
//     console: {
//         level: "debug",
//         handleExceptions: true,
//         format: winston.format.combine(
//             winston.format.colorize(),
//             winston.format.simple()
//         ),
//     },
// };

// // instantiate a new Winston Logger with the settings defined above
// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.File(options.file),
//         new winston.transports.Console(options.console),
//     ],
//     exitOnError: false, // do not exit on handled exceptions
// });

// // create a stream object with a 'write' function that will be used by `morgan`
// logger.stream = {
//     write: function (message, encoding) {
//         // use the 'info' log level so the output will be picked up by both
//         // transports (file and console)
//         logger.info(message);
//     },
// };

// module.exports = logger;

// const morgan = require('morgan');
// const winston = require("winston");
// const winstonDaily = require('winston-daily-rotate-file');
// const { forms } = winston;

// const logDir = 'logs';  // logs 디렉토리 하위에 로그 파일 저장
// const { combine, timestamp, printf } = winston.format;

// // Define log format
// const logFormat = printf(info => {
//     return `${info.timestamp} ${info.level}: ${info.message}`;
// });

// const colors = {
//     error: 'red',
//     warn: 'yellow',
//     info: 'green',
//     http: 'magenta',
//     debug: 'white',
// }

// winston.addColors(colors);

// /*
//  * Log Level
//  * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
//  */
// const logger = winston.createLogger({
//     format: combine(
//         timestamp({
//             format: 'YYYY-MM-DD HH:mm:ss',
//         }),
//         logFormat,
//     ),
//     transports: [
//         // info 레벨 로그를 저장할 파일 설정
//         new winstonDaily({
//             level: 'info',
//             datePattern: 'YYYY-MM-DD',
//             dirname: logDir,
//             filename: `%DATE%.log`,
//             maxFiles: 30,  // 30일치 로그 파일 저장
//             zippedArchive: true,
//         }),
//         // error 레벨 로그를 저장할 파일 설정
//         new winstonDaily({
//             level: 'error',
//             datePattern: 'YYYY-MM-DD',
//             dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장 
//             filename: `%DATE%.error.log`,
//             maxFiles: 30,
//             zippedArchive: true,
//         }),
//     ],
// });

// // Production 환경이 아닌 경우(dev 등) 
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.combine(
//             winston.format.colorize(),  // 색깔 넣어서 출력
//             winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
//         )
//     }));
// }



// module.exports = logger;







// loaders/logger.js
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process');

const { combine, timestamp, label, printf, colorize } = winston.format

//루트경로
const logDir = `${process.cwd()}/logs`;

//레벨
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}
//색상
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
}
winston.addColors(colors); // 색상 적용


const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'http'
}

//로그 포맷
const logFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    label({ label: 'Server Logs' }),
    printf((info) => {
        if (info.stack) {
            return `${info.timestamp} ${info.level}: ${info.message} \n Error Stack: ${info.stack}`
        }
        return `${info.timestamp} ${info.level}: ${info.message}`
    })
)

// 콘솔에 찍힐 때는 색깔을 구변해서 로깅해주자.
const consoleOpts = {
    handleExceptions: true,
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' })
    )
}

const transports = [
    new winston.transports.Console(consoleOpts),

    new winstonDaily({
        level: 'info', // info 레벨 로그를 저장할 파일 설정
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        filename: `%DATE%.log`, // %DATE% = 위에서 설정한 datePattern 이 들어감
        dirname: logDir,
        maxFiles: 30,  // 30일치 로그 파일 저장
    }),
    new winstonDaily({
        level: 'error', // error 레벨 로그를 저장할 파일 설정
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        filename: `%DATE%.error.log`,
        dirname: logDir + '/error',  // error.log 파일은 /logs/error 하위에 저장
        maxFiles: 30,
    }),
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format: logFormat,
    transports
})

module.exports = logger;