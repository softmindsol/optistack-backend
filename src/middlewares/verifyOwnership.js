import { PrismaClient } from '@prisma/client';
import ApiError from '../utils/ApiError.js';

const prisma = new PrismaClient();

/**
 * Middleware to verify that a resource belongs to the authenticated user
 * Prevents unauthorized access to other users' data
 * 
 * @param {string} model - Prisma model name (e.g., 'healthMetric', 'journal', 'reminder')
 * @param {string} paramName - URL parameter name containing resource ID (default: 'id')
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Protect journal entry access
 * router.get('/journal/:id', auth, verifyOwnership('journal'), controller.getEntry);
 * 
 * @example
 * // Protect health metric with custom param name
 * router.delete('/metrics/:metricId', auth, verifyOwnership('healthMetric', 'metricId'), controller.delete);
 */
const verifyOwnership = (model, paramName = 'id') => {
    return async (req, res, next) => {
        try {
            const resourceId = parseInt(req.params[paramName]);
            const userId = req.user.id;

            // Validate resource ID
            if (!resourceId || isNaN(resourceId)) {
                throw new ApiError(400, 'Invalid resource ID');
            }

            // Check if resource exists AND belongs to the authenticated user
            const resource = await prisma[model].findFirst({
                where: {
                    id: resourceId,
                    userId: userId  // Critical: ensures user owns this resource
                }
            });

            if (!resource) {
                // Don't reveal whether resource exists or just doesn't belong to user
                throw new ApiError(404, 'Resource not found or access denied');
            }

            // Attach resource to request for use in controller
            // This avoids duplicate database queries
            req.resource = resource;

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default verifyOwnership;
