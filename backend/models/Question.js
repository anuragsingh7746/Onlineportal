const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },

  correctAnswers : {
    type: String, 
    required : true,
  },

  test : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Tests',
  }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

