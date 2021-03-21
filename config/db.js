const mongoose = require('mongoose');
const config = require('config');
const keys = require('../config/keys');
const db = config.get('mongoURI');

const connectDB  = async () => {
    const opts =  {};
    opts.jwtSecret = keys.jwtSecret;
    opts.mongoURI = keys.mongoURI;
    try {
        await mongoose.connect(opts.mongoURI, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;