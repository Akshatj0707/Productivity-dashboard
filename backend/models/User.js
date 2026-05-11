const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true, minlength: 6 },
  role:       { type: String, enum: ['customer','admin'], default: 'customer' },
  plan:       { type: String, enum: ['Free','Starter','Pro','Enterprise'], default: 'Free' },
  status:     { type: String, enum: ['online','offline','busy'], default: 'offline' },
  avatar:     { type: String, default: '' },
  jobTitle:   { type: String, default: '' },
  company:    { type: String, default: '' },
  timezone:   { type: String, default: 'UTC+0 · GMT' },
  isActive:   { type: Boolean, default: true },
  loginCount: { type: Number, default: 0 },
  lastLogin:  { type: Date }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  if (!this.avatar && this.name)
    this.avatar = this.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
  next();
});

UserSchema.methods.comparePassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

UserSchema.methods.toSafe = function() {
  const o = this.toObject(); delete o.password; return o;
};

module.exports = mongoose.model('User', UserSchema);
