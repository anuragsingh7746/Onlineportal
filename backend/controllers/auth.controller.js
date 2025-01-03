const User = require('../models/user.model');
const Test = require('../models/test.model'); // Import the Test model

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    await user.populate({
      path: 'registered_tests.test_id',
      select: 'name',
    });

    await user.populate({
      path: 'given_tests.test_id',
      select: 'name',
    });

    const transformedRegisteredTests = user.registered_tests.map(test => ({
      _id: test._id,
      center_id: test.center_id,
      city: test.city,
      state: test.state,
      test_name: test.test_id?.name || test.test_name,
    }));

    const transformedGivenTests = user.given_tests.map(test => ({
      _id: test._id,
      score: test.score,
      city: test.city,
      state: test.state,
      test_name: test.test_id?.name, // Only include test_name
    }));

    const data = {
      id: user._id,
      username: user.username,
      role: user.role,
      registered_tests: transformedRegisteredTests,
      given_tests: transformedGivenTests,
    };

    res.json({
      message: 'Login successful',
      data,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
};

module.exports = {
  login,
};