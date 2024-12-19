const mongoose = require('mongoose');

// יצירת הסכמה של Publish
const publishSchema = new mongoose.Schema({
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
      message: 'Role must be either vet, dogwalker, or dogowner'
    }
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

// יצירת המודל Publish
const Publish = mongoose.model('Publish', publishSchema);

module.exports = Publish;
