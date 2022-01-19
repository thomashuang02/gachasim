const User = require('./models/User');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({username: username}, (err, user) => {
                if (err) throw err;
                console.log(user);
                if (!user) {
                    console.log('here');
                    return done(null, {DNE: true});
                }
                bcrypt.compare(password, user.password, (err, res) => {
                    if (err) throw err;
                    if (res) {
                        return done(null, user);
                    }
                    else {
                        return done(null, false);
                    }
                });
            });
        }
    ));

    passport.use(new JWTStrategy(
        {
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWTSecret,
        }, 
        (jwt_payload, done) => {
            User.findById(jwt_payload.user._id, (err, user) => {
                if (err) throw err;
                if (!user) return done(null, false, {
                    message: 'Invalid token'
                });
                return done(null, user);
            });
        }
    ));
}