const express = require("express");
const db = require("mongoose");
const sendGridMail = require("@sendgrid/mail");
const fs = require('fs');
const { body, validationResult } = require('express-validator');
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
app.post('/register',
    body('country_of_residence').isLength({ min: 1 }).withMessage('Country of residence is required.'),
    body('first_name').isLength({ min: 1 }).withMessage('First name is required.'),
    body('last_name').isLength({ min: 1 }).withMessage('Last name is required.'),
    body('email').isLength({ min: 1 }).withMessage('Email is required.').isEmail().withMessage('Email is invalid'),
    body('address_line_1').isLength({ min: 1 }).withMessage('Address is required.'),
    body('city').isLength({ min: 1 }).withMessage('City is required.'),
    body('state').isLength({ min: 1 }).withMessage('State is required.'),
    body('password').isLength({ min: 8 }).withMessage('Password must be 8 characters or more.').custom((match, { req }) => {
        if (match !== req.body.confirm_password) {
            throw new Error("Passwords do not match");
        } else {
            return value;
        }
    }),
    async (req, res) => {

        /*
        * Error validation
        */
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${msg}`;
        };
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.mapped() });
        }

        const { country_of_residence, first_name, last_name, email, password, confirm_password, address_line_1, address_line_2, city, state, zip, phone_number } = req.body;

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
                },
                phone_number
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
