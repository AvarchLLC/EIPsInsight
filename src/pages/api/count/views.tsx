// pages/api/count/views.tsx
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Check if the model already exists before defining it
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
      console.log('Connected to the database');
  })
  .catch((error: any) => {
      console.error('Error connecting to the database:', error.message);
  });
  
const countSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});
const Count = mongoose.models.Count || mongoose.model('Count', countSchema);

export default async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    // Use the aggregation pipeline to fetch the total view count
    const pipeline = [
      {
        $group: {
          _id: null,
          count: { $sum: '$count' },
        },
      },
    ];

    const result = await Count.aggregate(pipeline);
    console.log(result);
    

    if (result.length > 0) {
      res.status(200).json({ count: result[0].count });
    } else {
      res.status(200).json({ count: 0 });
    }
  } else if (req.method === 'POST') {
    // Use the updateOne method to increment the view count
    const pipeline = [
      {
        $inc: { count: 1 },
      },
    ];

    await Count.updateOne({}, pipeline, { upsert: true });

    const updatedCount = await Count.findOne({});

    if (updatedCount !== null) {
      res.status(200).json({ count: updatedCount.count });
    } else {
      // Handle the case where no document was found
      res.status(404).json({ error: 'No document found' });
    }
  }
};
