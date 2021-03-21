const jwt = require('jsonwebtoken');
// const config = require('config');
const keys = require('../config/keys');

module.exports = function (req, res, next) {
    const opts =  {};
    opts.jwtSecret = keys.secretOrKey;
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }
    try {
        const decoded = jwt.verify(token, opts.jwtSecret);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ msg: "Token is not valid"});  
    }
}