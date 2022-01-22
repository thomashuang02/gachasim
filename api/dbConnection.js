const mongoose = require("mongoose");

module.exports = () => {
    mongoose.connect(`mongodb+srv://${process.env.DBUser}:${process.env.DBPassword}@gachasim.aiahc.mongodb.net/gachasim?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Mongoose is connected.");
    }).catch(err => {
        console.log("Unable to connect to database:", err);
    });
};