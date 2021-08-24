// Packages
require('dotenv').config()
const express = require("express");
const mongodb = require("mongoose");
const sendGridMail = require("@sendgrid/mail");
const bcrypt = require('bcrypt');
const fs = require('fs');

// Initiate app
const app = express();

// .env
const SG_API_KEY = process.env.SG_API_KEY;
const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL

// Set Sendgrid API Key
sendGridMail.setApiKey(SG_API_KEY);

// Models
const User = require('./models/user');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: true
}));

// Routing
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})
app.get('/custlogin', (req, res) => {
    res.sendFile(__dirname + '/custlogin.html')
})

/*
*   Requests
*/
// POST request to register user
app.post('/register', async (req, res) => {

    const { country_of_residence, first_name, last_name, email, password, address_line_1, address_line_2, city, state, zip } = req.body;

    try {
        mongodb.connect(MONGO_DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("-- Connection to DB is successful --")

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

        const sg_email = {
            to: email,
            from: {
                name: 'iService Team',
                email: 'bfahad@deakin.edu.au',
            },
            subject: 'Welcome to iService!',
            html: fs.readFileSync(__dirname + '/public/emails/welcome.html', 'utf-8'),
        }

        await newUser.save();

        console.log("-- User created successfully --");

        res.sendFile(__dirname + '/login.html');

        sendGridMail.send(sg_email).then(res => {
            console.log('-- Email sent successfully --')
        }).catch(err => {
            console.log(err.message)
        });

    } catch (err) {
        console.log(err)
    }
})

// POST request for user authentication
app.post('/auth', async (req, res) => {

    const { email, password } = req.body;

    await mongodb.connect('mongodb+srv://brian:123Mongo@iservicedb.aoj5t.mongodb.net/iServiceDB?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("-- Connection to DB is successful --")

    const user = await User.findOne({
        email: email
    })
    const passwordCompare = bcrypt.compareSync(password, user.hpassword);

    if (passwordCompare) {
        res.sendFile(__dirname + '/custlogin.html')
    } else {
        console.log('-- password incorrect --')
    }

})

// Listen on PORT
app.listen(PORT, (req, res) => {
    console.log("Server is running on " + PORT)
})

// 404 error for any other page
app.get('*', function (req, res) {
    res.status(404).send('404');
});