const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');


// GET api/profile/me
// get current user's profile
// private
router.get('/me', auth,  async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['first_name', "last_name", "image_url", "last_login" ]);
        if (!profile) {
            return res.status(400).send({ msg: "There is no profile for this user"});
        }
        res.json(profile);  
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
});

// POST api/profile/money
// get update money
// private
router.post('/money',  [
    check('money', 'A new score is requires').not().isEmpty(),
    ], 
    auth,  async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()});
        }
        console.log('line 36', req.body.money)
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            if (!profile) {
                return res.status(400).send({ msg: "There is no profile for this user"});
            }
            profile.money = req.body.money;
            profile.modified = new Date();
            await profile.save();
            res.json(profile);  
        } catch (error) {
            console.error(error.message)
            res.status(500).send('Server Error')
        }
    }
);


// POST api/profile/socre
// get update score
// private
router.post('/score',  [
    check('score', 'A new score is requires').not().isEmpty(),
    ], 
    auth,  async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(400).send({ msg: "There is no profile for this user"});
        }
        profile.score = req.body.score;
        profile.modified = new Date();
        await profile.save();
        res.json(profile);  
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
});




module.exports = router;