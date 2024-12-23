// pages/api/register.js
import connectToDatabase from "../../lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcryptjs";

// POST method for user registration
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, terms } = req.body;

    // Check if terms are accepted
    if (!terms) {
      return res.status(400).json({ message: "You must accept the terms and conditions" });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to MongoDB
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully!" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
