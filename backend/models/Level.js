// models/Level.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: String,
  details: {
    questionText: String,
    options: [String],
    correctOption: String
  }
});

const levelSchema = new mongoose.Schema({
  level: Number,
  questions: [questionSchema]
});

module.exports = mongoose.model('Level', levelSchema);
