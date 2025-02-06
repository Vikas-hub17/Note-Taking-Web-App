const express = require("express");
const { createNote, getNotes, updateNote, deleteNote } = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/notes", authMiddleware, createNote);
router.get("/notes", authMiddleware, getNotes);
router.put("/notes/:id", authMiddleware, updateNote);
router.delete("/notes/:id", authMiddleware, deleteNote);

module.exports = router;
