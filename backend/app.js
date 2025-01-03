import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

// Middlewares
import errorHandler from './middlewares/errorHandler.js';
import extractDeviceInfo from './middlewares/deviceInfo.js';

// Routes
import authRoute from './routes/auth.js';
import notesRoute from './routes/notes.js';
import shareRoute from './routes/share.js';

const app = express();

const PORT = process.env.API_PORT || 3000;

app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3010',
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Apply routes
app.use('/api', extractDeviceInfo, authRoute);
app.use('/api', notesRoute);
app.use('/api', shareRoute);

// 404 handler
app.use((_, __, next) => {
    const error = new Error("The requested resource could not be found.");
    error.status = 404;
    next(error);
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
