//File: /server/routes/api/notes.js
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Note = require('../../models/Note');

// @route   POST /notes
// @desc    Create a new note
// @access  Public
router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, content } = req.body;

      const newNote = Note.create({ title, content });
      console.log(`[${new Date().toISOString()}] [NOTES API] Created note: ${newNote.id}`);
      res.status(201).json(newNote);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] [NOTES API] Error in POST /: ${err.message}`);
      return res.status(500).json({ error: 'Server Error' });
    }
  }
);

// @route   GET /notes
// @desc    Retreive all notes
// @access  Public
router.get('/', (req, res) => {
  try {
    const notes = Note.findAll();
    res.json(notes);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [NOTES API] Error in GET /: ${err.message}`);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route   GET /notes/:id
// @desc    Retreive a specific note by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const note = Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [NOTES API] Error in GET /${req.params.id}: ${err.message}`);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route   PUT /notes/:id
// @desc    Update an existing note
// @access  Public
router.put('/:id', (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedNote = Note.update(req.params.id, { title, content });

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    console.log(`[${new Date().toISOString()}] [NOTES API] Updated note: ${updatedNote.id}`);
    res.json(updatedNote);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [NOTES API] Error in PUT /${req.params.id}: ${err.message}`);
    return res.status(500).json({ error: 'Server Error' });
  }
});

// @route   DELETE /notes/:id
// @desc    Delete a note
// @access  Public
router.delete('/:id', (req, res) => {
  try {
    const isDeleted = Note.remove(req.params.id);

    if (!isDeleted) {
      return res.status(404).json({ error: 'Note not found' });
    }

    console.log(`[${new Date().toISOString()}] [NOTES API] Deleted note: ${req.params.id}`);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [NOTES API] Error in DELETE /${req.params.id}: ${err.message}`);
    return res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;