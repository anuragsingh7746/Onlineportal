
// controllers/student.controller.js
const User = require('../models/user.model');
const Log = require('../models/log.model');

const getStudentData = async (req, res) => {
  const { studentId, testId } = req.body;

  try {
    // Case 1: No studentId is provided
    if (!studentId) {
      const students = await User.find({ role: null}, { _id: 1}); // Only fetch student IDs
      const studentIds = students.map(student => student._id);
      return res.status(200).json({
        message: 'Student IDs fetched successfully.',
        student_ids: studentIds,
      });
    }

    // Fetch the student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Case 2: studentId is provided, but no testId
    if (!testId) {
      const givenTests = student.given_tests.map(test => test.test_id);
      return res.status(200).json({
        message: 'Given test IDs fetched successfully.',
        test_ids: givenTests,
      });
    }

    // Case 3: studentId and testId are provided
    const givenTest = student.given_tests.find(test => test.test_id.toString() === testId);
    if (!givenTest) {
      return res.status(404).json({ message: 'Test not found in student records.' });
    }

    // Fetch logs for the specified test and student
    const logs = await Log.find({ user_id: studentId, test_id: testId });

    res.status(200).json({
      message: 'Logs and score fetched successfully.',
      logs,
      score: givenTest.score,
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'An error occurred while fetching student data.' });
  }
};

module.exports = {
  getStudentData,
};
