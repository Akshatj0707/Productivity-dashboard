const mongoose = require('mongoose');
const ApiKeySchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  keyValue:    { type: String, required: true, unique: true },
  environment: { type: String, enum: ['production','staging'], default: 'production' },
  isActive:    { type: Boolean, default: true },
  lastUsed:    { type: Date }
}, { timestamps: true });
module.exports = mongoose.model('ApiKey', ApiKeySchema);
