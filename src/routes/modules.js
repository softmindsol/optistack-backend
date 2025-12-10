import express from 'express';
import authRoutes from './auth.routes.js';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
