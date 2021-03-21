const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
// const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const keys = require('../config/keys');

// POST api/users
// register user
// Public
router.post('/', [
    check('first_name', 'First name is required').not().isEmpty(),
    check('last_name', 'Last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter password 6 characters or longer').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    let { first_name, last_name, email, password } = req.body;
    try {
        let user = await User.findOne({ email});
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists'}]});
        }
        email = email.toLowerCase();
        user = new User ({
            first_name,
            last_name,
            email,
            password
        })
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const profile = new Profile({
            user: user._id
        })
        await profile.save();
        const payload = {
            user: {
                id: user.id
            }
        }
        const opts =  {};
        opts.jwtSecret = keys.secretOrKey;
        jwt.sign(
            payload, 
            opts.jwtSecret,
            { expiresIn: 360000},
            (err, token) => {
                if (err) throw err
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// PUT api/users
// update user
// Private
router.put('/', auth, async (req, res) => {
    console.log('here')
    let { first_name, last_name } = req.body;
    try {
        console.log( req.user.id)
        let user = await User.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'User does not exist'}]});
        }
        user.first_name = first_name;
        user.last_name = last_name;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;