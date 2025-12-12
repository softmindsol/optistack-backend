import stackService from '../services/stack.service.js';
import catchAsync from '../utils/catchAsync.js';

const addToStack = catchAsync(async (req, res) => {
    const stackItem = await stackService.addToStack(req.user.id, req.body);
    res.status(201).send(stackItem);
});

const getStack = catchAsync(async (req, res) => {
    const stack = await stackService.getStack(req.user.id);
    res.send(stack);
});

const updateStackItem = catchAsync(async (req, res) => {
    const stackItem = await stackService.updateStackItem(req.user.id, req.params.id, req.body);
    res.send(stackItem);
});

const removeFromStack = catchAsync(async (req, res) => {
    await stackService.removeFromStack(req.user.id, parseInt(req.params.id));
    res.status(204).send();
});

export default {
    addToStack,
    getStack,
    updateStackItem,
    removeFromStack,
};
