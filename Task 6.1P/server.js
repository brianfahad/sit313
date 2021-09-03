// Packages
require('dotenv').config()
const express = require("express");
const mongodb = require("mongoose");
const sendGridMail = require("@sendgrid/mail");
const bcrypt = require('bcrypt');
const cookie_parser = require('cookie-parser')
const fs = require('fs');
const { body, validationResult } = require('express-validator');

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
const Expert = require('./models/expert');

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
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


/*
*   POST request to register user
*/
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
    }), async (req, res) => {

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

        const { country_of_residence, first_name, last_name, email, password, address_line_1, address_line_2, city, state, zip, phone_number } = req.body;

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
                },
                phone_number
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
*   POST request to register expert
*/
app.route('/experts')
    .post(
        body('country_of_residence').isLength({ min: 1 }).withMessage('Country of residence is required.'),
        body('first_name').isLength({ min: 1 }).withMessage('First name is required.'),
        body('last_name').isLength({ min: 1 }).withMessage('Last name is required.'),
        body('email').isLength({ min: 1 }).withMessage('Email is required.').isEmail().withMessage('Email is invalid'),
        body('address_line_1').isLength({ min: 1 }).withMessage('Address is required.'),
        body('city').isLength({ min: 1 }).withMessage('City is required.'),
        body('state').isLength({ min: 1 }).withMessage('State is required.'),
        body('password').isLength({ min: 8 }).withMessage('Password must be 8 characters or more.').custom((value, { req }) => {
            if (value !== req.body.confirm_password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }), async (req, res) => {
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

            const { country_of_residence, first_name, last_name, email, password, address_line_1, address_line_2, city, state, zip, phone_number } = req.body;

            try {
                mongoConnect()

                const hpassword = bcrypt.hashSync(password, 10);
                const newExpert = new Expert({
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
                    },
                    phone_number
                })

                await newExpert.save();

                res.send('Expert created successfully');

            } catch (err) {
                if (err.code === 11000) {
                    res.send("Email already exist")
                    return;
                }
                res.send(err)
            }
        })
    .get(async (req, res) => {


        try {
            mongoConnect();

            res.send(await Expert.find())
        } catch (error) {
            res.send(error)
        }

    }).delete(async (req, res) => {


        try {
            mongoConnect();

            await Expert.deleteMany()
            res.send('All experts have been deleted')
        } catch (error) {
            res.send(error)
        }
    })
/*
*   POST request to remove expert
*/
app.route('/experts/:id')
    // .put(
    //     body('country_of_residence').isLength({ min: 1 }).withMessage('Country of residence is required.'),
    //     body('first_name').isLength({ min: 1 }).withMessage('First name is required.'),
    //     body('last_name').isLength({ min: 1 }).withMessage('Last name is required.'),
    //     body('email').isLength({ min: 1 }).withMessage('Email is required.').isEmail().withMessage('Email is invalid'),
    //     body('address_line_1').isLength({ min: 1 }).withMessage('Address is required.'),
    //     body('city').isLength({ min: 1 }).withMessage('City is required.'),
    //     body('state').isLength({ min: 1 }).withMessage('State is required.'),
    //     body('password').isLength({ min: 8 }).withMessage('Password must be 8 characters or more.').custom((value, { req }) => {
    //         if (value !== req.body.confirm_password) {
    //             throw new Error("Passwords do not match");
    //         }
    //         return true;
    //     }), async (req, res) => {

    //         /*
    //         * Error validation
    //         */
    //         const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    //             return `${msg}`;
    //         };
    //         const errors = validationResult(req).formatWith(errorFormatter);
    //         if (!errors.isEmpty()) {
    //             return res.status(400).json({ errors: errors.mapped() });
    //         }

    //         try {
    //             mongoConnect()

    //             await Expert.findOneAndUpdate({
    //                 _id: req.params.id
    //             }, req.body)
    //             res.send('User updated')


    //         } catch (err) {
    //             if (err.code === 11000) {
    //                 res.send("Email already exist")
    //                 return;
    //             }
    //             res.send(err)
    //         }
    //     })
    .get(async (req, res) => {

        mongoConnect();

        try {
            res.send(await Expert.findOne({
                _id: req.params.id
            }))
        } catch (error) {
            res.send(error)
        }

    })
    .delete(async (req, res) => {

        mongoConnect();

        try {
            await Expert.deleteOne({
                _id: req.params.id
            })
            res.send('User has been deleted')
        } catch (error) {
            res.send(error)
        }
    })
    // .put(async (req, res) => {

    //     try {
    //         mongoConnect()


    //         await Expert.findOneAndUpdate({
    //             _id: req.params.id
    //         }, {
    //             phone_number: req.body.phone_number,
    //             address_line_1: req.body.address_line_1,
    //             address_line_2: req.body.address_line_2,
    //             city: req.body.city,
    //             state: req.body.state,
    //             zip: req.body.zip
    //         })


    //         res.send('User updated')


    //     } catch (err) {
    //         if (err.code === 11000) {
    //             res.send("Email already exist")
    //             return;
    //         }
    //         res.send(err)
    //     }
    // })
    .put(
        body('password').isLength({ min: 8 }).withMessage('Password must be 8 characters or more.').custom((value, { req }) => {
            if (value !== req.body.confirm_password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }), async (req, res) => {


            try {
                mongoConnect();

                const hashedPassword = bcrypt.hashSync(req.body.password, 10);

                await Expert.findOneAndUpdate({
                    _id: req.params.id
                }, {
                    hpassword: hashedPassword
                })


                res.send('Password updated')


            } catch (err) {
                if (err.code === 11000) {
                    res.send("Email already exist")
                    return;
                }
                res.send(err)
            }
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