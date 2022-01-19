require('dotenv').config();

/* --------------------------------- imports -------------------------------- */
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const connection = require("./dbConnection");
const bodyParser = require('body-parser');

/* ---------------------- global variable declarations ---------------------- */
const app = express();
const PORT = process.env.PORT;

/* ------------------------------- middleware ------------------------------- */
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/* ----------------------------- passport config ---------------------------- */
require('./passportConfig')(passport);

/* ------------------------------ route imports ----------------------------- */
const authenticationRoutes = require('./routes/authentication');
app.use('/api/auth', authenticationRoutes);

const GenshinImpactRoutes = require('./routes/GenshinImpact');
app.use('/api/genshin-impact', GenshinImpactRoutes);

/* -------------------- default route: serving index.html ------------------- */
app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, '../client/build/index.html'));
    res.send('hey');
});
app.get('*', (req, res) => {
    res.redirect('/');
});

/* ------------------- connect to database, listen on port ------------------ */
connection();
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});