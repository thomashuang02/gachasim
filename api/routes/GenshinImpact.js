const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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

module.exports = router;