const process = require('process');
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models').users;

module.exports = () => {
    passport.use(new kakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: 'http://43.200.157.0:4000/auth/kakao/callback',
        clientSecret: process.env.KAKAO_SECRET_KEY
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken);
        // console.log('kakao profile', profile)
        let result = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile,
        };
        // console.log(result);
        try {
            const exUser = await User.findOne({
                where: {
                    user_id: profile.id,
                    provider: 'kakao',
                }
            });
            if (exUser) {
                // result.save();
                done(null, exUser);
            }
            else {
                const newUser = await User.create({
                    // email: profile._json.kakao_account.email,
                    user_id: profile.id,
                    provider: 'kakao',
                    token: refreshToken
                });
                done(null, newUser)
            }
        } catch (error) {
            console.error(error);
            done(error)
        }
    }))
}