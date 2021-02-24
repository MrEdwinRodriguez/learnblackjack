const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    score : { type: Number, default: 0 },
    money: { type: Number, default: 1000 },
    date: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);