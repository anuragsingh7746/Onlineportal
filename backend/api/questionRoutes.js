const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionController");

// @route   GET /api/questions
// @desc    Get all questions
router.get("/", getQuestions);

module.exports = router;
