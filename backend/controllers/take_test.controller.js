
// controllers/take_test.controller.js
const User = require('../models/user.model');
const Test = require('../models/test.model');
const Question = require('../models/question.model');

const takeTest = async (req, res) => {
  const { userId, testId } = req.body;

  // Validate that both userId and testId are provided
  if (!userId || !testId) {
    return res.status(400).json({ message: 'User ID and Test ID are required.' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is enrolled in the test
    const isEnrolled = user.registered_tests.some(
      (test) => test.test_id.toString() === testId
    );
    if (!isEnrolled) {
      return res.status(403).json({ message: 'User is not enrolled in this test.' });
    }

    // Find the test by ID
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found.' });
    }

    // Check if the test start time is in the past or current time
    const currentTime = new Date();
    if (test.start_time > currentTime) {
      return res.status(403).json({ message: 'Test is not yet available to take.' });
    }

    // Fetch all questions for this test without including the correct answer
    const questions = await Question.find(
      { _id: { $in: test.questions } },
      { correct_answer: 0 } // Exclude the correct_answer field
    );

    // Return the questions with options
    res.status(200).json({
      message: 'Test is ready to take.',
      questions: questions.map((q) => ({
        _id: q._id,
        question_text: q.question_text,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error('Error preparing test:', error);
    res.status(500).json({ message: 'An error occurred while preparing the test.' });
  }
};

module.exports = {
  takeTest,
};
