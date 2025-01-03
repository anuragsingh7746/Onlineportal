const mongoose = require('mongoose');
const Log = require('../models/log.model');
const Test = require('../models/test.model');
const FlaggedResult = require('../models/flaggedResult.model');
const User = require('../models/user.model');

exports.evaluateTest = async (req, res) => {
  try {
    const { testId } = req.body;

    if (!testId || !mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: 'Valid testId is required' });
    }

    // Check if the test exists
    const test = await Test.findById(testId).populate('questions');
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Check if flagged results already exist for this test
    const existingFlaggedResult = await FlaggedResult.findOne({ test_id: testId });
    if (existingFlaggedResult) {
      const flaggedUserDetails = await User.find(
        { _id: { $in: existingFlaggedResult.flagged_users } },
        { username: 1 }
      );
      return res.status(200).json({
        message: 'Evaluation already completed',
        flagged_users: flaggedUserDetails.map((user) => ({
          _id: user._id,
          username: user.username,
        })),
        flagged_centers: existingFlaggedResult.flagged_centers,
        summary: existingFlaggedResult.summary,
      });
    }

    // Calculate Total Registered and Total Given Students
    const users = await User.find({}, { registered_tests: 1, given_tests: 1, username: 1 });

    let totalRegistered = 0;
    let totalGiven = 0;

    const registeredUserIds = new Set();
    const givenUserIds = new Set();

    users.forEach((user) => {
      // Check both registered_tests and given_tests for registration
      const isRegistered =
        user.registered_tests.some((test) => test.test_id.equals(testId)) ||
        user.given_tests.some((test) => test.test_id.equals(testId));

      if (isRegistered) {
        totalRegistered++;
        registeredUserIds.add(user._id.toString());
      }

      // Check only given_tests for completion
      if (user.given_tests.some((test) => test.test_id.equals(testId))) {
        totalGiven++;
        givenUserIds.add(user._id.toString());
      }
    });

    const totalNotGiven = totalRegistered - totalGiven;

    // Analyze Logs for Flagged Users
    const logsForTest = await Log.find({ test_id: testId });

    const flaggedUsers = new Set();
    const centerFlags = {};

    logsForTest.forEach((log) => {
      const userId = log.user_id.toString();
      const centerId = log.center_id._id.toString();

      // Track flagged users per center
      if (!centerFlags[centerId]) centerFlags[centerId] = { total: 0, flagged: 0 };
      centerFlags[centerId].total++;

      let suspiciousCorrects = 0;
      let totalCorrects = 0;

      // Check tab switches
      if (log.tab_switch > 0) {
        flaggedUsers.add(userId);
        centerFlags[centerId].flagged++;
        return;
      }

      // Analyze engagement and answers
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

        const question = test.questions.find((q) => q._id.equals(questionId));
        if (!question) return;

        const correctAnswer = question.correct_answer;
        const correctLog = visits.find((entry) => {
          const match = entry.activity_text.match(/Selected option (\d+)/);
          return match && parseInt(match[1], 10) === correctAnswer;
        });

        if (correctLog) {
          totalCorrects++;
          if (hops < 3 && timeSpent < 10) {
            suspiciousCorrects++;
          }
        }
      });

      if (totalCorrects > 0 && (suspiciousCorrects / totalCorrects) >= 0.25) {
        flaggedUsers.add(userId);
        centerFlags[centerId].flagged++;
      }
    });

    // Calculate Flagged Centers
    const flaggedCenters = Object.keys(centerFlags).filter((centerId) => {
      const { total, flagged } = centerFlags[centerId];
      return flagged / total >= 0.1;
    });

    // Fetch user details for flagged users
    const flaggedUserDetails = await User.find(
      { _id: { $in: Array.from(flaggedUsers) } },
      { username: 1 }
    );

    // Save Flagged Results
    const flaggedResult = new FlaggedResult({
      test_id: testId,
      flagged_users: Array.from(flaggedUsers),
      flagged_centers: flaggedCenters.map((id) => new mongoose.Types.ObjectId(id)),
      summary: {
        total_registered: totalRegistered,
        total_given: totalGiven,
        total_not_given: totalNotGiven,
        total_flagged: flaggedUsers.size,
      },
    });
    await flaggedResult.save();

    // Respond with Results
    return res.status(200).json({
      message: 'Evaluation complete',
      flagged_users: flaggedUserDetails.map((user) => ({
        _id: user._id,
        username: user.username,
      })),
      flagged_centers: flaggedCenters,
      summary: {
        total_registered: totalRegistered,
        total_given: totalGiven,
        total_not_given: totalNotGiven,
        total_flagged: flaggedUsers.size,
      },
    });
  } catch (error) {
    console.error('Error evaluating test logs:', error);
    return res.status(500).json({ error: 'An error occurred during evaluation.' });
  }
};
