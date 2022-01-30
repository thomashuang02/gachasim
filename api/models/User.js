const mongoose = require('mongoose');

/* ----------------------------- genshin impact ----------------------------- */
const GenshinCharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    constellations: {
        type: Number,
        min: 0,
        max: 6
    },
});
const GenshinWeaponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    refinementLevel: {
        type: Number,
        min: 0,
        max: 5
    },
});
const GenshinImpactSchema = new mongoose.Schema({
    numPrimogems: Number,
    numAcquaintFates: Number,
    numIntertwinedFates: Number,
    inventory: {
        characters: [GenshinCharacterSchema],
        weapons: [GenshinWeaponSchema]
    },
    moneySpent: Number,
});


/* ---------------------------------- user ---------------------------------- */
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