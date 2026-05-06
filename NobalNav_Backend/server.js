import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://nobalnav_admin:Admin1234@cluster0.ossvluy.mongodb.net/?appName=Cluster0";
dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
];
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB - nobalnav_database");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  } finally {
    await client.close();
  }
}

run();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // required for cookies to be sent cross-origin
}));

app.use(express.json());
app.use(cookieParser()); // parse cookies from incoming requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'NobalNav API running' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(' Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));