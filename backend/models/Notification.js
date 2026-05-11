const mongoose = require('mongoose');
const NotifSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  icon:     { type: String, default: 'ℹ️' },
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  isRead:   { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Notification', NotifSchema);
