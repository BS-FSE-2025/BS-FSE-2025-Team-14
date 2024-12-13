const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // המערכת לא תאפשר יצירת שני משתמשים עם אותו שם משתמש
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['vet', 'dogowner', 'dogwalker'] // שלושה סוגים של משתמשים
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
