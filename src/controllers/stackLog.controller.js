import stackLogService from '../services/stackLog.service.js';
import catchAsync from '../utils/catchAsync.js';

const logStackItem = catchAsync(async (req, res) => {
    const log = await stackLogService.logStackItem(req.user.id, req.body);
    res.status(201).send(log);
});

const markAllCompleted = catchAsync(async (req, res) => {
    const logs = await stackLogService.markAllCompleted(req.user.id, req.body);
    res.status(200).send(logs);
});

const getLogs = catchAsync(async (req, res) => {
    const date = req.query.date; // Optional query param
    const logs = await stackLogService.getLogs(req.user.id, date);
    res.send(logs);
});

export default {
    logStackItem,
    markAllCompleted,
    getLogs,
};
