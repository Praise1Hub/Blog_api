import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Blog API is running'
    });
});

const port = process.env.PORT || 7000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
    } catch (error) {
        console.warn('Database not connected, continuing without DB:', error.message || error);
    }

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer();