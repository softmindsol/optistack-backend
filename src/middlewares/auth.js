import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

const prisma = new PrismaClient(); 

const auth = catchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new ApiError(401, 'You are not logged in! Please log in to get access.')
        );
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { role: true },
    });

    if (!currentUser) {
        return next(
            new ApiError(
                401,
                'The user belonging to this token does no longer exist.'
            )
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

export default auth;
