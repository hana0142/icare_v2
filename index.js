const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userRouter = require('./routes/user.route');
const checkRouter = require('./routes/check.route');
const resultRouter = require('./routes/result.route');

//routes
app.use(cookieParser());
app.use(session({
    key: 'key',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: 60 * 60 * 24
    },
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//app_routes
app.use('/', userRouter);
app.use('/api/check', checkRouter);
app.use("/api/result", resultRouter);

const PORT = process.env.PORT;
app.set(PORT);
app.listen(PORT, () => {
    console.log(`app started on port ${PORT}`)
});
