const mongoose = require('mongoose');
const GoalSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true, trim: true },
  description:{ type: String, default: '' },
  progress:   { type: Number, default: 0, min: 0, max: 100 },
  target:     { type: Number, default: 100 },
  dueDate:    { type: Date },
  color:      { type: String, default: '#0d9488' },
  isComplete: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Goal', GoalSchema);
