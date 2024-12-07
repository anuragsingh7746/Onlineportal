const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flaggedResultSchema = new Schema({
  test_id: {
    type: Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  flagged_users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  flagged_centers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Center',
    },
  ],
  flagged_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FlaggedResult', flaggedResultSchema);
