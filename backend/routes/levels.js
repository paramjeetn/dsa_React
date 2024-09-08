const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

// Delete a Level
router.delete('/:levelId', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    if (!level) return res.status(404).json({ message: 'Level not found' });

    await level.deleteOne();
    res.json({ message: 'Level deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:levelId/questions', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    if (!level) return res.status(404).json({ message: 'Level not found' });

    const newQuestion = {
      title: req.body.title,  // Capture the question title
      text: req.body.text,
      details: req.body.details
    };

    level.questions.push(newQuestion);
    const updatedLevel = await level.save();
    
    res.status(201).json(updatedLevel.questions[updatedLevel.questions.length - 1]);
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
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.title = req.body.title || question.title;
    question.text = req.body.text || question.text;
    question.details = req.body.details || question.details;

    const updatedLevel = await level.save();
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Question within a Level
router.delete('/:levelId/questions/:questionId', async (req, res) => {
  try {
    const level = await Level.findById(req.params.levelId);
    if (!level) {
      console.error('Level not found:', req.params.levelId);
      return res.status(404).json({ message: 'Level not found' });
    }

    const question = level.questions.id(req.params.questionId);
    if (!question) {
      console.error('Question not found:', req.params.questionId);
      return res.status(404).json({ message: 'Question not found' });
    }

    // Use deleteOne to remove the specific subdocument
    question.deleteOne();

    const updatedLevel = await level.save();

    console.log('Question deleted:', req.params.questionId);
    return res.status(200).json({ message: 'Question deleted successfully', level: updatedLevel });
  } catch (err) {
    console.error('Error deleting question:', err.message);
    return res.status(500).json({ message: 'Failed to delete question', error: err.message });
  }
});



module.exports = router;
