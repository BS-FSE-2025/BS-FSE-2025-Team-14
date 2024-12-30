const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  device_name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'location is required'],
    maxlength: [500, 'location cannot exceed 500 characters']
  },
  Temperature: {
    type: Number,
    required: [true, 'Temperature is required'],
    
  },
  mac: {
    type : String,
    required: [true, 'mac is required'],
    maxlength: [20, 'mac cannot exceed 20 characters']
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Reading = mongoose.model('Reading', readingSchema);

module.exports = Reading;