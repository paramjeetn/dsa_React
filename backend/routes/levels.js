// routes/levels.js
const express = require('express');
const router = express.Router();
const Level = require('../models/Level');

// Get all levels
router.get('/', async (req, res) => {
  try {
    const levels = await Level.find();
    res.json(levels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new level
router.post('/', async (req, res) => {
  const level = new Level({
    level: req.body.level,
    questions: req.body.questions
  });

  try {
    const newLevel = await level.save();
    res.status(201).json(newLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a question's details
router.put('/:levelId/questions/:questionId', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    const question = level.questions.id(req.params.questionId);
    question.details = req.body.details;
    await level.save();
    res.json(level);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
