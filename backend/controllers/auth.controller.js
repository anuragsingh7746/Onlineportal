// controllers/auth.controller.js
const User = require('../models/user.model');

const login = async (req, res) => {
  const { username, password } = req.body;

  // Check if all required fields are present
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Find user by username
    const user = await User.findOne({ username });
    const data = [user.username, user.role, user.registered_tests, user.given_tests];
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Send user data as response (excluding sensitive data like password if necessary)
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
