const mongoose = require('mongoose');

const mdFilesSchema = new mongoose.Schema({
    eip: { type: String, unique: true },
    title: { type: String },
    author: { type: String },
    status: { type: String },
    type: { type: String },
    category: { type: String },
    created: { type: String },
});

const MdFiles = mongoose.model('MdFiles', mdFilesSchema);

module.exports = MdFiles;
