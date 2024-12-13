const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // מודל המשתמשים
const Recommendation = require('./models/Recommendation'); // מודל המלצות

const app = express();
app.use(express.json()); // מאפשר לקבל בקשות ב-JSON
app.use(cors({
  origin: "http://localhost:3000"
}));

// חיבור ל-MongoDB Atlas
// const dbURI = 'mongodb+srv://yaelle:<levin>@cluster0.dnotx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // עדכן את ה-URI שלך
const dbURI = 'mongodb+srv://yaelle:petpath2024@cluster0.dnotx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

// API להרשמה (הוספת משתמש חדש)
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // בדוק אם המשתמש קיים כבר במערכת
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // יצירת סיסמה מוצפנת
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    User.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.log(`Failed to register user: ${err}`);
    res.status(500).json({ error: 'Error registering user', err });
  }
});

// API להתחברות (אימות משתמש)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // חיפוש המשתמש במסד הנתונים
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  // השוואת סיסמאות
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid username or password' });
  }

  // החזרת נתונים על המשתמש אם הסיסמה נכונה
  res.status(200).json({ message: 'Login successful', user });
});

app.post('/postRecommendation', async (req, res) => {
  const { name, description, role } = req.body;

  try {
    Recommendation.create({ name, description, role });
  } catch (err) {
    console.log("failed :((((");
  }
});

// הפעלת השרת
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
