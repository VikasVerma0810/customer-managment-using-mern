import express from 'express';
import mongoose from 'mongoose';
import customerRoutes from './routes/customerRoutes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from your frontend domain
  }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/customer').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api', customerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
