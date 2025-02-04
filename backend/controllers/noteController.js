const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({ userId: req.userId, title, content });
  await newNote.save();
  res.json(newNote);
};

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).sort({ createdAt: 1 });
  res.json(notes);
};

exports.updateNote = async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedNote);
};

exports.deleteNote = async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted' });
};