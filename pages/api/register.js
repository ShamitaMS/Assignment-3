// pages/api/register.js

import { connectToDatabase } from "../../utils/mongodb"; // Import MongoDB connection utility
import bcrypt from "bcryptjs"; // For password hashing
import { setCookie } from "nookies"; // To set cookies if needed

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, terms } = req.body;

    // Check if terms and conditions are accepted
    if (!terms) {
      return res.status(400).json({ message: "You must accept the terms and conditions" });
    }

    // Validate the email and password
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const { db } = await connectToDatabase();
      console.log("Connected to database:", db.databaseName);  // Log the database name

      // Check if the user already exists
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the user into the database
      const result = await db.collection("users").insertOne({
        email,
        password: hashedPassword,
        terms,
      });

      console.log("User inserted:", result);  // Log the result of the insertion

      // Set a cookie or session (optional)
      setCookie({ res }, "userToken", result.insertedId.toString(), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error inserting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
