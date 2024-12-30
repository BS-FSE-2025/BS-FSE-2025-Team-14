const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Token is required'],
    maxlength: [2000, 'Token cannot exceed 2000 characters']
  },
  refreshtoken: {
    type: String,
    required: [true, 'RefreshToken is required'],
    maxlength: [2000, 'RefreshToken cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    default: Date.now,
  },
  expires: {
    type: Number,
    required: [true, 'Expires is required'],
  }
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;