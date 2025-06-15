const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
  contestId: Number,
  contestName: String,
  rank: Number,
  oldRating: Number,
  newRating: Number,
  ratingChange: Number,
  date: String, 
  unsolvedCount: Number,
}, { _id: false });

const ProblemStatsSchema = new mongoose.Schema({
  mostDifficult: Number,
  totalSolved: Number,
  avgRating: Number,
  avgPerDay: Number,
  buckets: {
    type: Map,
    of: Number,
  },
  heatmap: {
    type: Map,
    of: Number,
  },
}, { _id: false });

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
    type: [ContestSchema],
    default: [],
  },

  problemStats: {
    type: ProblemStatsSchema,
    default: {},
  },
  inactivityReminders: {
  count: { type: Number, default: 0 },
  lastReminder: { type: Date },
  disabled: { type: Boolean, default: false },
}
});

module.exports = mongoose.model('Student', StudentSchema);
