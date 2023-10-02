const mongoose = require('mongoose');

// Define the StatusChange schema
const allissuesSchema = new mongoose.Schema({
    issue: {
        type: Number,
    },
});

// Create the StatusChange model
const all_issues = mongoose.model('all_issues', allissuesSchema);

module.exports = all_issues;