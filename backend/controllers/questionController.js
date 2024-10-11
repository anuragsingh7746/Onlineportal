const Question = require("../models/Question");

// Fetch all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getQuestions };
