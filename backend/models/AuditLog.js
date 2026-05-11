const mongoose = require('mongoose');
const AuditLogSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName:  { type: String, default: 'Unknown' },
  event:     { type: String, required: true },
  ipAddress: { type: String, default: '0.0.0.0' },
  status:    { type: String, enum: ['success','error'], default: 'success' },
  metadata:  { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
module.exports = mongoose.model('AuditLog', AuditLogSchema);
