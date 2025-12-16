import aiService from '../services/ai.service.js';
import catchAsync from '../utils/catchAsync.js';

const handleAIChat = catchAsync(async (req, res) => {
    const { message, localHistory } = req.body;
    const response = await aiService.generateResponse(req.user.id, message, localHistory);

    res.status(200).json({
        status: 'success',
        data: {
            message: response
        }
    });
});

export default {
    handleAIChat,
};
