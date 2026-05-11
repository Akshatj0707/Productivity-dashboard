const mongoose = require('mongoose');
const IntegrationSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  icon:        { type: String },
  description: { type: String },
  category:    { type: String },
  isConnected: { type: Boolean, default: false },
  connectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  connectedAt: { type: Date }
}, { timestamps: true });
module.exports = mongoose.model('Integration', IntegrationSchema);
