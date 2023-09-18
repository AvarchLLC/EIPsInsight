const mongoose = require('mongoose');

// Define the StatusChange schema
const allprsSchema = new mongoose.Schema({
    pr: {
        type: Number,
    },
});

// Create the StatusChange model
const all_prs = mongoose.model('all_prs', allprsSchema);

module.exports = all_prs;