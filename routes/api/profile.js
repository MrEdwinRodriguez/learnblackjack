const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


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



module.exports = router;