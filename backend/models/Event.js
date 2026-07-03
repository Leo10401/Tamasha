const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  user: { type: String, required: true },
  avatar: { type: String, default: 'https://avatar.iran.liara.run/public' },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

const timelineSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  }
});

const contactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  }
});

const RegisteredUserSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['Going', 'Not Going', 'Maybe'],
    default: 'Maybe'
  }
});

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  mode:{
    type: String,
    enum: ['Online', 'Offline'],
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  googleMapLink: {
    type: String,
  },
  registeredUsers: {
    type: [RegisteredUserSchema],
    default: [],
  },
  contact:[contactSchema],
  timeline: [timelineSchema],
  CreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  CommentSchema: [CommentSchema],
  faqs: {
    type: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ]
  }
});

module.exports = mongoose.model('Event', eventSchema);