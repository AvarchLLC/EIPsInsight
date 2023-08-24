const mongoose = require('mongoose');

const prDetailsSchema = new mongoose.Schema({
    prNumber: { type: Number },
    prTitle: { type: String },
    prDescription: { type: String },
    labels: { type: [String] },
    conversations: { type: [Object] },
    numConversations: { type: Number },
    participants: { type: [String] },
    numParticipants: { type: Number },
    commits: { type: [Object] },
    numCommits: { type: Number },
    filesChanged: { type: [String] },
    numFilesChanged: { type: Number },
    mergeDate: { type: Date },
});

const PrDetails = mongoose.model('PrDetails', prDetailsSchema);

module.exports = PrDetails;