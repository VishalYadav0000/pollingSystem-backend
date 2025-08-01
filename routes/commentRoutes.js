import express from 'express';
import {
  createComment,
  getCommentsByPoll
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:pollId', protect, createComment);
router.get('/:pollId', getCommentsByPoll);

export default router;
