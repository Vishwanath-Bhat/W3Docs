// models/Template.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  thumbnail: { type: String }, // URL or base64
  content: { type: Object }, // The actual template structure
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', templateSchema);