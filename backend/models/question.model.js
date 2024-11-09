// models/question.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  question_text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, 'Options array should have exactly 4 items.'],
  },
  correct_answer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
});

function arrayLimit(val) {
  return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);
