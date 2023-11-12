const passport = require('passport')
// const local = require('./localStrategy')
const User = require('../models').users;
const kakao = require('./kakaoStrategy');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    })

    passport.deserializeUser((user_id, done) => {
        User.findOne({ where: { user_id } })
            .then(user => done(null, user))
            .catch(err => done(err))
    })
    // localStrategy 미들웨어 적용
    kakao();
}