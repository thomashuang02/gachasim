const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

const authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return next(err);
        }
        if (user.DNE) {
            return res.status(404).send(
                {
                    usernameError: true,
                    passwordError: false,
                    message: `can't find that user.`
                }
            );
        }
        if (!user) {
            return res.status(401).send(
                {
                    usernameError: false,
                    passwordError: true,
                    message: `incorrect password.`
                }
            );
        }
        req.login(user, () => {
            const body = { _id: user._id, username: user.username }
            const token = jwt.sign({user: body}, process.env.JWTSecret);
            return res.json({token});
        });
    })(req, res, next);
}

//auth routes here
router.post('/login', (req, res, next) => {
    authenticate(req, res, next);
});
router.post('/register', (req, res, next) => {
    if(req.body.username) {
        User.findOne({username: req.body.username}, async (err, user) => {
            if (err) throw err;
            if (user) {
                res.status(409).send(
                    {
                        usernameError: true,
                        passwordError: false,
                        message: `sorry, that username's taken.`
                    }
                );
            }
            else {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const newUser = new User({
                    username: req.body.username,
                    password: hashedPassword,
                    GenshinImpact: {
                        numPrimogems: 0,
                        numGenesisCrystals: 0,
                        numAcquaintFates: 0,
                        numIntertwinedFates: 0,
                        inventory: {
                            characters: [],
                            weapons: []
                        },
                        moneySpent: 0,
                    },
                    dateJoined: Date.now(),
                    totalMoneySpent: 0
                });
                await newUser.save();
                authenticate(req, res, next);
            }
        });
    } else {
        res.status(500).send(
            {
                usernameError: true,
                passwordError: false,
                message: `sorry, something's gone wrong.`
            }
        );
    }
});
router.get('/current-user', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if(!req.user) {
            res.status(403);
        }
        else {
            const body = { username: req.user.username }
            res.json(body);
        }
    }
);

module.exports = router;