import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  optionIndex: { type: Number }
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
export default Vote;
