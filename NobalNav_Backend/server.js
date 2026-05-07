import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGO_URI = process.env.MONGODB_URI; 

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
];

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("nobalnav_database").command({ ping: 1 });
    console.log("MongoClient connected to nobalnav_database");
  } catch (err) {
    console.error(" MongoClient connection failed:", err.message);
  }
}

run();

mongoose.connect(MONGO_URI)
  .then(() => console.log("Mongoose connected to nobalnav_database"))
  .catch(err => console.error("Mongoose connection failed:", err.message));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.json({ message: 'NobalNav API running' }));

app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));