const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    pageName: String,
    likeCount: Number,
    dislikeCount: Number
  });
  
const Like = mongoose.model('Like', likeSchema);


module.exports = Like;
