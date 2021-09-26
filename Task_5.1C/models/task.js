const db = require('mongoose');

var TaskSchema = new db.Schema(
    {
        task_type:
        {
            type: String,
            required: true
        },
        title:
        {
            type: String,
            required: true
        },
        description:
        {
            type: String,
            required: true
        },
        suburb:
        {
            type: String,
            required: true,
        },
        date:
        {
            type: String,
            required: true,
        },
        budget:
        {
            type: String,
            required: false,
        },
        budget_value:
        {
            type: String,
            required: false,
        },
    });

db.model('Task', TaskSchema);
module.exports = db.model('Task')