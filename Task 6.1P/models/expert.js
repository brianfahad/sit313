const db = require('mongoose');

var UserSchema = new db.Schema(
    {
        country_of_residence:
        {
            type: String,
            required: true
        },
        first_name:
        {
            type: String,
            required: true
        },
        last_name:
        {
            type: String,
            required: true
        },
        email:
        {
            type: String,
            required: true,
            match: /.+\@.+\..+/,
        },
        hpassword:
        {
            type: String,
            required: true,
        },
        address:
        {
            address_line_1: {
                type: String,
                required: true,
            },
            address_line_2: {
                type: String,
                required: false,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            zip: {
                type: String,
                required: true,
            },
        },
        phone_number:
        {
            type: String,
            required: false,
        },
        created_at: {
            type: Date,
            default: Date.now
        },
    });

db.model('Expert', UserSchema);
module.exports = db.model('Expert')