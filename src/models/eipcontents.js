const mongoose = require('mongoose');

// Define the StatusChange schema
const eipcontentsSchema = new mongoose.Schema({
    eip: {
        type: Number,
    },
    content: { type: String },
});

// Create the StatusChange model
const eip_contents = mongoose.model('eip_contents', eipcontentsSchema);

module.exports = eip_contents;