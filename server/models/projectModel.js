const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: Object },
  group: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);
