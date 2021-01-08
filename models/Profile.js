const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    score : { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
})

module.exports = Profile = mongoose.model('profile', ProfileSchema);