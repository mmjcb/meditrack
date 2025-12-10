// src/backend/server.js
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// Required to use __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "meditrack-7c53a.firebasestorage.app", // Use your Firebase storage bucket
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Example: Create user in Firestore (optional route)
app.post("/api/users", async (req, res) => {
  try {
    const { fname, lname, username, email } = req.body;
    const userRef = db.collection("users").doc();
    await userRef.set({
      fname,
      lname,
      username,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

export { db };
