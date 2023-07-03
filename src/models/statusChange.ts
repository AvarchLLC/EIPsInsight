const mongoose = require('mongoose');

// Define the StatusChange schema
const statusChangeSchema = new mongoose.Schema({
    eip: {
        type: String,
        required: true
    }, 
    fromStatus: {
        type: String,
        required: true,
    },
    toStatus: {
        type: String,
        required: true,
    },
    changeDate: {
        type: Date,
        required: true,
    },
    changedDay: {
        type: Number,
        required: true,
    },
    changedMonth: {
        type: Number,
        required: true,
    },
    changedYear: {
        type: Number,
        required: true,
    },
});

// Create the StatusChange model
const StatusChange = mongoose.model('StatusChange', statusChangeSchema);

module.exports = StatusChange;

