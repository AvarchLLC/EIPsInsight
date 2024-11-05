import { Request, Response } from 'express';
import { Octokit } from "@octokit/rest";

const mongoose = require('mongoose');


  
  // Create a model based on the schema
if (mongoose.connection.readyState === 0) {
    if (typeof process.env.MONGODB_URI === 'string') {
        mongoose.connect(process.env.MONGODB_URI);
    } else {
        // Handle the case where the environment variable is not defined
        console.error('MONGODB_URI environment variable is not defined');
    }
}


    const likeSchema = new mongoose.Schema({
        pageName: String,
        likeCount: Number,
        dislikeCount: Number
      });
      
  const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);
    

export default async (req: Request, res: Response) => {
    try {
        const pageName = "like";
    
        // Find the like count document for the given page name, create it if it doesn't exist
        let likeDoc = await Like.findOne({ pageName });
    
        if (!likeDoc) {
          likeDoc = new Like({ pageName, likeCount: 0, dislikeCount:0 });
        }
    
        // Increment the like count
        likeDoc.likeCount++;
        await likeDoc.save();
    
          res.json({ pageName, likeCount: likeDoc.likeCount, dislikeCount: likeDoc.dislikeCount });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
};


