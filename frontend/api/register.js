import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs'; // Use bcrypt for password hashing

// MongoDB setup (make sure your MongoDB is running)
const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'user_db';
let db;

// Connect to MongoDB
async function connectToDatabase() {
  if (!db) {
    const connection = await client.connect();
    db = connection.db(dbName);
  }
  return db;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, termsAgreed } = req.body;

    // Check if the user agreed to the terms
    if (!termsAgreed) {
      return res.status(400).json({ error: 'You must agree to the terms and conditions.' });
    }

    // Check for missing email or password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      // Connect to the database
      const db = await connectToDatabase();

      // Check if the email already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email.' });
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Store user data in the database (with hashed password)
      const newUser = { email, password: hashedPassword, termsAgreed };
      const result = await db.collection('users').insertOne(newUser);

      // Convert ObjectId to string and send a response
      res.status(200).json({ message: 'Registration successful!', userId: result.insertedId.toString() });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Error during registration' });
    }
  } else {
    // If it's not a POST request, respond with a 405 Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
