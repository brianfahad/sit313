// Packages
require('dotenv').config()
const express = require("express");
const mongodb = require("mongoose");
const sendGridMail = require("@sendgrid/mail");
const bcrypt = require('bcrypt');
const cookie_parser = require('cookie-parser')
const fs = require('fs');

// Initiate app
const app = express();

// .env
const SG_API_KEY = process.env.SG_API_KEY;
const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL
const COOKIE_KEY = process.env.COOKIE_KEY

// Set Sendgrid API Key
sendGridMail.setApiKey(SG_API_KEY);

// Models
const User = require('./models/user');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(cookie_parser(COOKIE_KEY))

// Routing
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})
app.get('/custlogin', routeAuth, (req, res) => {
    res.sendFile(__dirname + '/custlogin.html')
})
app.get('*', function (req, res) {
    res.status(404).send('404');
});


/*
*   POST request to register user
*/
app.post('/register', async (req, res) => {

    const { country_of_residence, first_name, last_name, email, password, address_line_1, address_line_2, city, state, zip } = req.body;

    try {
        mongoConnect()

        const hpassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            country_of_residence,
            first_name,
            last_name,
            email,
            hpassword,
            address: {
                address_line_1,
                address_line_2,
                city,
                state,
                zip
            }
        })

        await newUser.save();
        console.log("-- User created successfully --");

        res.redirect('/login');

        sendEmail(email)

    } catch (err) {
        if (err.code === 11000) {
            res.send("Email already exist")
            return;
        }
        res.send(err)
    }
})

/*
*   POST request for user authentication
*/
app.post('/auth', async (req, res) => {

    let user;
    const { email, password } = req.body;

    mongoConnect()

    try {
        user = await User.findOne({
            email: email
        }).orFail();
    } catch {
        res.status('401').send('User does not exist')
        return;
    }

    comparePassword(password, user.hpassword, res)

    res.cookie('iService', user._id, { signed: true })
    res.redirect('/custlogin')
})

/*
*   Function to connect mongo database
*/
async function mongoConnect() {
    await mongodb.connect(MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("-- Connection to DB is successful --")
}

/*
*   Function to send emails through the send grid API
*/
function sendEmail(email) {
    const sg_email = {
        to: email,
        from: {
            name: 'iService Team',
            email: 'bfahad@deakin.edu.au',
        },
        subject: 'Welcome to iService!',
        html: fs.readFileSync(__dirname + '/public/emails/welcome.html', 'utf-8'),
    }

    try {
        sendGridMail.send(sg_email);
        console.log('-- Email sent successfully --')
    } catch (error) {
        console.log(error)
    }
}

/*
*   Function to compare passwords
*/
function comparePassword(password, hpassword, res) {
    const comparePw = bcrypt.compareSync(password, hpassword)
    if (!comparePw) {
        res.send('Password is incorrect')
        return;
    }
}

/*
*   Function to check cookie and re-route if user is not authenticated
*/
function routeAuth(req, res, next) {
    const cookie = req.signedCookies.iService

    if (cookie) {
        next()
    } else {
        res.redirect('/login')
    }
}

// Listen on PORT
app.listen(PORT, (req, res) => {
    console.log("Server is running on " + PORT)
})