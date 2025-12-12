import dailyCheckInService from '../services/dailyCheckIn.service.js';
import catchAsync from '../utils/catchAsync.js';

const createCheckIn = catchAsync(async (req, res) => {
    const checkIn = await dailyCheckInService.createCheckIn(req.user.id, req.body);
    res.status(201).send(checkIn);
});

export default {
    createCheckIn,
};
