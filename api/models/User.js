const mongoose = require('mongoose');

const GenshinImpactSchema = new mongoose.Schema({
    numAcquaintFates: Number,
    numIntertwinedFates: Number,
    collection: {
        characters: [Object],
        weapons: [Object]
    },
    moneySpent: Number,
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateJoined: Date,
    GenshinImpact: GenshinImpactSchema,
    totalMoneySpent: Number
});

module.exports = mongoose.model('User', UserSchema);