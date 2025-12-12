import express from 'express';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import journalValidation from '../validations/journal.validation.js';
import journalController from '../controllers/journal.controller.js';

const router = express.Router();

router.use(auth);

// Journal Routes
router
    .route('/entries')
    .post(validate(journalValidation.createJournal), journalController.createJournal)
    .get(journalController.getJournals);

// Mood Log Routes
router
    .route('/moods')
    .post(validate(journalValidation.createMoodLog), journalController.createMoodLog)
    .get(journalController.getMoodLogs);

export default router;
