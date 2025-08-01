import asyncHandler from 'express-async-handler';
import Comment from '../models/Comment.js';
import Poll from '../models/Poll.js';

const createComment = asyncHandler(async (req, res) => {
  const { content, parent } = req.body;
  const pollId = req.params.pollId;

  const poll = await Poll.findById(pollId);
  if (!poll) {
    res.status(404);
    throw new Error('Poll not found');
  }

  const comment = new Comment({
    poll: poll._id,
    user: req.user._id,
    content,
    parent: parent || null,
  });

  const createdComment = await comment.save();

  const populatedComment = await createdComment.populate('user');
  res.status(201).json(populatedComment);
});

// Get all comments of a poll
const getCommentsByPoll = asyncHandler(async (req, res) => {
  const pollId = req.params.pollId;

  const comments = await Comment.find({ poll: pollId })
    .populate('user')
    .sort({ createdAt: 1 });

  res.json(comments);
});

export { createComment, getCommentsByPoll };
