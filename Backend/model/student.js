const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },

  codeforcesHandle: {
    type: String,
    required: true,
    unique: true,
  },

  currentRating: {
    type: Number,
    default: 0,
  },

  maxRating: {
    type: Number,
    default: 0,
  },

  lastSynced: {
    type: Date,
    default: null,
  },

  contestHistory: {
    type: [Object],
    default: [],
  },

  submissions: {
    type: [Object],
    default: [],
  },
});

module.exports = mongoose.model('Student', StudentSchema);
