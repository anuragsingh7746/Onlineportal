const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  testId: {
    type: String,
    required: true,
  },
  centerId: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  testLocation: {
    type: String,
    required: true,
  },
  logs: [
    {
      action: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        required: true,
      },
    },
  ],
}, {
  timestamps: true, 
});

const Logs = mongoose.model('Logs', logSchema);

module.exports = Logs;
