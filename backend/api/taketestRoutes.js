const express = require('express');
const router = express.Router();
const { getquestion } = require('../controllers/taketest');

// Route to get all questions for a specific test by testId
router.get('/:testId/questions', getquestion);

module.exports = router;
