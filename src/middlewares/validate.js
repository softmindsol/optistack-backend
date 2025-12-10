import ApiError from '../utils/ApiError.js';
import { z } from 'zod';

const validate = (schema) => (req, res, next) => {
    try {
        // Validate request body, query, and params against the schema
        const object = {
            body: req.body,
            query: req.query,
            params: req.params,
        };
        const validSchema = z.object(schema);
        const parsed = validSchema.parse(object);

        // Assign parsed values back to request to ensure type safety/transformation
        Object.assign(req, parsed);

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Format Zod errors
            const errorMessage = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
            return next(new ApiError(400, errorMessage));
        }
        next(error);
    }
};

export default validate;
