const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const User = require('../models/User');

const portraitDir = path.join(__dirname, '../public/images/genshin-character-art/portraits-resized');

const getPortraitURLs = () => {
    try {
        const files = fs.readdirSync(portraitDir);
        const paths = files.map(fn => `/images/genshin-character-art/portraits-resized/${fn}`);
        return paths;
    }
    catch (e) {
        return false;
    }
}

router.get('/character-portraits', (req, res) => {
    const paths = getPortraitURLs();
    if (paths) {
        res.json({
            error: false,
            paths: paths
        });
    }
    else {
        res.json({
            error: true
        })
    }
});
router.get('/profile', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        if(!req.user) {
            res.status(403);
        }
        else {
            const user = await User.findOne({username: req.user.username});
            if(user) {
                res.json(user.GenshinImpact);
            }
            else {
                res.status(404).send(
                    {
                        error: true,
                        message: `could not find that user.`
                    }
                );
            }
        }
    }
);

module.exports = router;