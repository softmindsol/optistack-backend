import express from 'express';
import authRoutes from './auth.routes.js';
import dailyCheckInRoutes from './dailyCheckIn.routes.js';
import productRoutes from './product.routes.js';
import stackRoutes from './stack.routes.js';
import stackLogRoutes from './stackLog.routes.js';
import journalRoutes from './journal.routes.js';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/daily-check-in',
        route: dailyCheckInRoutes,
    },
    {
        path: '/products',
        route: productRoutes,
    },
    {
        path: '/stack',
        route: stackRoutes,
    },
    {
        path: '/stack-log',
        route: stackLogRoutes,
    },
    {
        path: '/journal',
        route: journalRoutes,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
