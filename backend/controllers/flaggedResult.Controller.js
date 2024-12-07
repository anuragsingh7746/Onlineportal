const mongoose = require('mongoose'); // Ensure mongoose is imported
const Log = require('../models/log.model');
const Question = require('../models/question.model');
const Test = require('../models/test.model');
const FlaggedResult = require('../models/flaggedResult.model');

exports.evaluateTest = async (req, res) => {
  try {
    const { testId } = req.body;

    if (!testId) {
      return res.status(400).json({ error: 'testId is required' });
    }

    // Check if flagged result for this test already exists
    const existingFlaggedResult = await FlaggedResult.findOne({ test_id: testId });
    if (existingFlaggedResult) {
      return res.status(200).json({
        message: 'Evaluation already completed',
        flagged_users: existingFlaggedResult.flagged_users,
        flagged_centers: existingFlaggedResult.flagged_centers,
      });
    }

    const logsForTest = await Log.find({ test_id: testId }).populate(
      'test_id center_id logs.location times.question_id'
    );

    if (!logsForTest.length) {
      return res.status(404).json({ error: 'No logs found for the provided testId' });
    }

    const test = await Test.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const flaggedUsers = new Set();
    const centerFlags = {};
    const questionMap = {};

    // Map questions for quick access
    for (const question of test.questions) {
      questionMap[question._id.toString()] = question;
    }

    for (const log of logsForTest) {
      const userId = log.user_id;
      const centerId = log.center_id;
      let suspiciousCorrects = 0;
      let totalCorrects = 0;

      // Check tab switches
      if (log.tab_switch > 0) {
        flaggedUsers.add(userId);
      }

      // Evaluate question answering patterns
      const questionVisits = {};
      log.logs.forEach((entry) => {
        const questionId = entry.location ? entry.location.toString() : null;
        if (questionId) {
          if (!questionVisits[questionId]) questionVisits[questionId] = [];
          questionVisits[questionId].push(entry);
        }
      });

      log.times.forEach((timeEntry) => {
        const questionId = timeEntry.question_id.toString();
        const timeSpent = timeEntry.time_spent;
        const visits = questionVisits[questionId] || [];
        const hops = visits.length;

        const question = questionMap[questionId];
        if (!question) return;

        // Check if the answer is correct
        const correctAnswer = question.correct_answer;
        const correctLog = visits.find((entry) => {
          const match = entry.activity_text.match(/Selected option (\d+)/);
          return match && parseInt(match[1], 10) === correctAnswer;
        });

        if (correctLog) {
          totalCorrects++;
          if (hops < 3 && timeSpent < 10) { // Example: 10 seconds threshold
            suspiciousCorrects++;
          }
        }
      });

      // Check 25% rule
      if (totalCorrects > 0 && (suspiciousCorrects / totalCorrects) >= 0.25) {
        flaggedUsers.add(userId);
      }

      // Track flagged students by center
      if (!centerFlags[centerId]) centerFlags[centerId] = 0;
      if (flaggedUsers.has(userId)) {
        centerFlags[centerId]++;
      }
    }

    const flaggedCenters = Object.keys(centerFlags)
      .filter((centerId) => {
        const flaggedCount = centerFlags[centerId];
        const totalStudents = logsForTest.filter((log) =>
          log.center_id.equals(centerId)
        ).length;
        return flaggedCount / totalStudents >= 0.1; // Example: 10% threshold
      })
      .filter((centerId) => mongoose.isValidObjectId(centerId)) // Validate ObjectId
      .map((centerId) => new mongoose.Types.ObjectId(centerId)); // Use `new`

    // Save flagged results
    const flaggedResult = new FlaggedResult({
      test_id: testId,
      flagged_users: Array.from(flaggedUsers),
      flagged_centers: flaggedCenters,
    });

    await flaggedResult.save();

    res.status(200).json({
      message: 'Evaluation complete',
      flagged_users: Array.from(flaggedUsers),
      flagged_centers: flaggedCenters,
    });
  } catch (error) {
    console.error('Error evaluating test logs:', error);
    res.status(500).json({ error: 'An error occurred during evaluation' });
  }
};
