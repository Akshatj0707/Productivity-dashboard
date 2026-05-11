const { isConnected } = require('../db');
let real = null;
function getModels() {
  if (isConnected()) {
    if (!real) real = {
      User: require('./User'), Task: require('./Task'), Goal: require('./Goal'),
      Integration: require('./Integration'), ApiKey: require('./ApiKey'),
      AuditLog: require('./AuditLog'), Notification: require('./Notification')
    };
    return real;
  }
  return require('../mockDB');
}
module.exports = { getModels };
