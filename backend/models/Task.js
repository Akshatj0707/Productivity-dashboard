const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  priority:    { type: String, enum: ['high','medium','low'], default: 'medium' },
  status:      { type: String, enum: ['backlog','inprogress','review','done'], default: 'backlog' },
  tags:        [{ type: String }],
  assignees:   [{ type: String }],
  creatorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate:     { type: Date }
}, { timestamps: true });
module.exports = mongoose.model('Task', TaskSchema);
