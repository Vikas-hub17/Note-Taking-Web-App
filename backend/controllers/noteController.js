const Note = require("../models/Note");

exports.createNote = async (req, res) => {
  try {
    console.log("Received Data:", req.body);
    console.log("Authenticated User ID:", req.user.userId);  // Debugging

    const { title, text, audioUrl, image } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newNote = new Note({ userId: req.user.userId, title, text, audioUrl, image });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ message: "Error saving note", error });
  }
};

// Get User's Notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

// Update Note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error });
  }
};

// Delete Note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error });
  }
};
