// models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: { type: Object },
  title: { type: String, default: 'Untitled Document' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },  // Will track last modification time
  thumbnail: { type: String }  // Will store base64 encoded image or URL
});

// Middleware to update updatedAt before saving
documentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to update updatedAt before updating
documentSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Document', documentSchema);
