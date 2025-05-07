import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import env from './config/envConfig.js';
import connectToMongoDB from './config/mongoConfig.js';
import configureRoutes from './routes/index.js';

dotenv.config();

const app = express();
const port = env.PORT || 3000;

// Connect to MongoDB
connectToMongoDB();

// Global middleware
app.use(cors());
app.use(express.json());

// TODO: Add rate limiting middleware (e.g., express-rate-limit)
// TODO: Add Redis caching middleware (for product search responses)
// TODO: Add centralized error handling middleware
// TODO: Add logging middleware (e.g., morgan, winston)

// Route setup using centralized constructor method
configureRoutes(app);

// TODO: Add monitoring integrations and graceful shutdowns

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
