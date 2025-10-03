const mongoose = require('mongoose');

const FOLLOW_UP_STATUS = [
  'Positive',
  'Negative',
  'Book Demo',
  'Request to Meet/Visit',
];

const followUpSchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      required: true,
      trim: true,
    },
    childName: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: FOLLOW_UP_STATUS,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teacher',
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    reminderAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('followup', followUpSchema);
