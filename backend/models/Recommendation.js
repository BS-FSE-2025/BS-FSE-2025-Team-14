const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['vet', 'dogwalker', 'dogowner'],
      message: 'Role must be either dogowner, vet or dogwalker'
    }
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
