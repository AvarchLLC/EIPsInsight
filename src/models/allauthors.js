const mongoose = require('mongoose');

// Define the StatusChange schema
const allcontributorsSchema = new mongoose.Schema({
    contributor: { type: String },
});

// Create the StatusChange model
const all_contributors = mongoose.model('all_contributors', allcontributorsSchema);

module.exports = all_contributors;