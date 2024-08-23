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
    questions: req.body.questions || []
  });

  try {
    const newLevel = await level.save();
    res.status(201).json(newLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a level and its questions
router.put('/:levelId', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    if (!level) return res.status(404).json({ message: 'Level not found' });

    level.level = req.body.level || level.level;
    level.questions = req.body.questions || level.questions;

    const updatedLevel = await level.save();
    res.json(updatedLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a new Question to a Level
router.post('/:levelId/questions', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    if (!level) return res.status(404).json({ message: 'Level not found' });

    const newQuestion = {
      text: req.body.text,
      details: req.body.details
    };

    level.questions.push(newQuestion);
    const updatedLevel = await level.save();
    res.status(201).json(updatedLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing Question within a Level
router.put('/:levelId/questions/:questionId', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    if (!level) return res.status(404).json({ message: 'Level not found' });

    const question = level.questions.id(req.params.questionId);
    if (question) {
      // Update existing question
      question.text = req.body.text || question.text;
      question.details = req.body.details || question.details;
    } else {
      return res.status(404).json({ message: 'Question not found' });
    }

    const updatedLevel = await level.save();
    res.json(updatedLevel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Question within a Level
router.delete('/:levelId/questions/:questionId', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    if (!level) return res.status(404).json({ message: 'Level not found' });

    const question = level.questions.id(req.params.questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.remove();
    const updatedLevel = await level.save();

    res.json({ message: 'Question deleted', level: updatedLevel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
