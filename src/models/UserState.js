const mongoose = require('mongoose');

const UserStateSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
  currentAmount: Number,
  isWarmMode: Boolean,
  isTargetReached: Number
});

module.exports = mongoose.model('UserState', UserStateSchema);
