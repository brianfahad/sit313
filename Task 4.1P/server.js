const express = require("express");
const db = require("mongoose");
const sendGridMail = require("@sendgrid/mail");
const fs = require('fs');

const app = express();
const PORT = 8080;

const SG_API_KEY = 'SEND_GRID_API_KEY';
sendGridMail.setApiKey(SG_API_KEY);

// Import Models
const User = require('./models/user');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Post data to the user model and send email
app.post('/register', async (req, res) => {

    const { country_of_residence, first_name, last_name, email, password, address_line_1, address_line_2, city, state, zip } = req.body;

    try {
        db.connect('MONGO_DB_CONNECTION_URL', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("-- Connection to DB is successful --")

        const newUser = new User({
            country_of_residence,
            first_name,
            last_name,
            email,
            password,
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

        res.send("User created successfully");

        sendGridMail.send(sg_email).then(res => {
            console.log('-- Email sent successfully --')
        }).catch(err => {
            console.log(err.message)
        });

    } catch (err) {
        console.log(err)
    }
})

app.listen(PORT, (req, res) => {
    console.log("Server is running on " + PORT)
})
