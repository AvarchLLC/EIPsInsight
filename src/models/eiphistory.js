const mongoose = require('mongoose');

const eipHistorySchema = new mongoose.Schema({
    eip: { type: String } ,
    title: { type: String },
    author: { type: String },
    status: { type: String },
    type: { type: String },
    category: { type: String },
    created: { type: String }, 
    mergedDate: { type: Date },
    prNumber: { type: Number },
    closedDate: { type: Date },
    mergedDay: { type: Number },
    mergedMonth: { type: Number },
    mergedYear: { type: Number },
    commitSha: { type: String },
    commitDate: { type: Date },
});

const EipHistory = mongoose.model('EipHistory', eipHistorySchema);

module.exports = EipHistory;
