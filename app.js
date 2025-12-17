import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import webhookRoutes from './src/routes/webhook.routes.js';
// Import routes
import routes from './src/routes/modules.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());

// Webhook route needs raw body for signature verification
// Must be defined BEFORE express.json()
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());
app.use(morgan('dev'));

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Opti-stack Backend is running' });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Not Found - ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});

export default app;
