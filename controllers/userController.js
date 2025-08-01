import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';

// Register
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) throw new Error('User already exists');

    const user = await User.create({ username, email, password });
    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
    });
});

// Login
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// Profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate(['createdPolls', 'votedPolls']);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { registerUser, authUser, getUserProfile, updateProfile };
