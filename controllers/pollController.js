import asyncHandler from 'express-async-handler';
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';

// Create Poll
const createPoll = asyncHandler(async (req, res) => {
    const { question, options } = req.body;

    const poll = new Poll({
        question,
        options: options.map(text => ({ text })),
        createdBy: req.user._id,
    });

    const createdPoll = await poll.save();
    req.user.createdPolls.push(createdPoll._id);
    await req.user.save();

    res.status(201).json(createdPoll);
});

// Get All Polls
const getPolls = asyncHandler(async (req, res) => {
    const polls = await Poll.find().populate('createdBy', 'username');
    res.json(polls);
});

// Get Single Poll
const getPollById = asyncHandler(async (req, res) => {
    const poll = await Poll.findById(req.params.id).populate('createdBy', 'username');
    if (poll) res.json(poll);
    else {
        res.status(404);
        throw new Error('Poll not found');
    }
});

// Vote on a Poll
const votePoll = asyncHandler(async (req, res) => {
    const poll = await Poll.findById(req.params.id);
    const { optionIndex } = req.body;

    const alreadyVoted = await Vote.findOne({
        poll: poll._id,
        user: req.user._id,
    });

    if (alreadyVoted) {
        res.status(400);
        throw new Error('You have already voted on this poll');
    }

    if (poll && poll.options[optionIndex]) {
        poll.options[optionIndex].votes += 1;

        const vote = new Vote({
            poll: poll._id,
            user: req.user._id,
            optionIndex,
        });

        await vote.save();
        await poll.save();

        req.user.votedPolls.push(poll._id);
        await req.user.save();

        res.json({ message: 'Vote recorded' });
    } else {
        res.status(404);
        throw new Error('Poll or Option not found');
    }
});

// Get Polls by Logged-in User
const getUserPolls = asyncHandler(async (req, res) => {
    const created = await Poll.find({ createdBy: req.user._id });
    const voted = await Vote.find({ user: req.user._id }).populate('poll');
    const votedPolls = voted.map(v => v.poll);

    res.json({ created, voted: votedPolls });
});

export {
    createPoll,
    getPolls,
    getPollById,
    votePoll,
    getUserPolls,
};
