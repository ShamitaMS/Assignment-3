import { MongoClient } from "mongodb";

// Use the 127.0.0.1 address if that's what you're using for MongoDB
const MONGODB_URI = "mongodb://127.0.0.1:27017";  // Change to the correct MongoDB URI
const MONGODB_DB = "user_db";  // Your database name

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to avoid reconnecting every time
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
    clientPromise = global._mongoClientPromise;
  }
} else {
  // In production mode, always create a new connection
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(MONGODB_DB);  // Connect to the user_db database
    return { client, db };
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to the database");
  }
}
