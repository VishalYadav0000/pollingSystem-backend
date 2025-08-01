import express from 'express';
import {
  createPoll,
  getPolls,
  getPollById,
  votePoll,
  getUserPolls
} from '../controllers/pollController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPoll);
router.get('/', getPolls);
router.get('/user', protect, getUserPolls);
router.get('/:id', getPollById);
router.post('/:id/vote', protect, votePoll);

export default router;
