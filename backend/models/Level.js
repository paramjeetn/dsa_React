const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  details: {
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOption: { type: String, required: true }
  }
});

const levelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  questions: [questionSchema]
});

module.exports = mongoose.model('Level', levelSchema);
