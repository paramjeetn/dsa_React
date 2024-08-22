const express = require('express');
const Question = require('../models/question');
const router = express.Router();

router.post('/', async (req, res) => {
  const question = new Question({
    text: req.body.text,
    options: req.body.options,
    correctOption: req.body.correctOption,
    difficulty: req.body.difficulty,
    tags: req.body.tags
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    await question.remove();
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
