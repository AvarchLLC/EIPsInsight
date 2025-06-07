import { MongoClient } from "mongodb";

// Extend the global type to include `_mongoClientPromise`
declare global {
  // Allow global to be extended in Node.js
  // In dev mode, reuse client to avoid too many connections
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export only the function
export const connectToDatabase = () => clientPromise;
