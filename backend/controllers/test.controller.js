
// controllers/test.controller.js
const User = require('../models/user.model');
const Test = require('../models/test.model');

const getUpcomingUnregisteredTests = async (req, res) => {
  const { userId } = req.body;

  // Validate that userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract test IDs from registered and given tests
    const registeredTestIds = user.registered_tests.map((test) => test.test_id.toString());
    const givenTestIds = user.given_tests.map((test) => test.test_id.toString());

    // Combine the two arrays into a Set to remove duplicates
    const excludedTestIds = new Set([...registeredTestIds, ...givenTestIds]);

    // Get the current date and time
    const currentTime = new Date();

    // Find all tests that are not in the excludedTestIds and have a start_time greater than the current time
    const upcomingUnregisteredTests = await Test.find({
      _id: { $nin: Array.from(excludedTestIds) },
      start_time: { $gt: currentTime },
    });

    // Return unregistered and ungiven upcoming tests
    res.status(200).json(upcomingUnregisteredTests);
  } catch (error) {
    console.error('Error fetching unregistered upcoming tests:', error);
    res.status(500).json({ message: 'An error occurred while fetching tests.' });
  }
};

module.exports = {
  getUpcomingUnregisteredTests,
};
