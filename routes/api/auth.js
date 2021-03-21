const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// GET api/auth
// authenticate
// private 
router.get('/', auth, async (req, res) => {
    console.log('line 14')
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error")
        
    }
});

// POST api/auth
// Authenticate user and get token
// Public
router.post('/', [
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Password is required.').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
    }
    let { email, password } = req.body;
    try {
        email = email.toLowerCase();
        let user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload, 
            config.get('jwtSecret'),
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


module.exports = router;