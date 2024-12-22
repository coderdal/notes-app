import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
// Middlewares
import errorHandler from './middlewares/errorHandler.js';
// Routes
import authRoute from './routes/auth.js';

const app = express();

const PORT = process.env.API_PORT || 3000;

app.use(cors({ origin: '*', credentials: true }));

app.use(express.json());

app.use(morgan('dev'));

app.use('/auth', authRoute);

app.use((_, __, next) => {
    const error = new Error("The requested resource could not be found.");
    error.status = 404;
    next(error);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
