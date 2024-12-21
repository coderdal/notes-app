import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';

const app = express();

const PORT = process.env.API_PORT || 3000;

app.use(express.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('System is up and running !');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
