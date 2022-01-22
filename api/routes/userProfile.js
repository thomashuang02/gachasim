const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

router.get('/full', 
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if(!req.user) {
            res.status(403);
        }
        else {
            User.findOne({username: req.user.username}, async (err, user) => {
                if (err) throw err;
                if (user) {
                    const body = { 
                        _id: user._id,
                        username: user.username,
                        dateJoined: user.dateJoined
                    }
                    res.json(body);
                }
                else {
                    res.status(404);
                }
            });
        }
    }
);

module.exports = router;