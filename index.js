const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');

//session package
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const sessionPool = require('pg').Pool;
// const bodyParser = require('body-parser');
// const morgan = require('morgan');

const userRouter = require('./routes/user.route');
const checkRouter = require('./routes/check.route');
const resultRouter = require('./routes/result.route');
const morganMiddleware = require('./config/morganMiddleware');

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;

//logger, morgan
global.logger || (global.logger = require('./config/logger'));

app.use(cookieParser());

const sessionDBaccess = new sessionPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

const sessionConfig = {
    store: new pgSession({
        pool: sessionDBaccess,
        tableName: 'session'
    }),
    name: 'SID',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    secure: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
        httpOnly: false,
        secure: false
    }
};

app.use(session(sessionConfig));
app.use(express.json());
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    // 'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'origin': 'http://43.200.157.0:4000',
    'credentials': true
}));
app.use(express.urlencoded({ extended: true }))
app.use(morganMiddleware);

//app_routes
app.use('/', userRouter);
app.use('/api/check', checkRouter);
app.use("/api/result", resultRouter);

//port
app.set(PORT);
app.listen(PORT, () => {
    console.log(`app started on port ${PORT}`)
});
