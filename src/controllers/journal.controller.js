import journalService from '../services/journal.service.js';
import catchAsync from '../utils/catchAsync.js';

const createJournal = catchAsync(async (req, res) => {
    const journal = await journalService.createJournal(req.user.id, req.body);
    res.status(201).send(journal);
});

const getJournals = catchAsync(async (req, res) => {
    const journals = await journalService.getJournals(req.user.id);
    res.send(journals);
});

const createMoodLog = catchAsync(async (req, res) => {
    const moodLog = await journalService.createMoodLog(req.user.id, req.body);
    res.status(201).send(moodLog);
});

const getMoodLogs = catchAsync(async (req, res) => {
    const moodLogs = await journalService.getMoodLogs(req.user.id);
    res.send(moodLogs);
});

export default {
    createJournal,
    getJournals,
    createMoodLog,
    getMoodLogs,
};
