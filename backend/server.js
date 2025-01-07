
const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // מודל המשתמשים
const Recommendation = require('./models/Recommendation'); // מודל המלצות
const Publish = require('./models/Publish'); // מודל פרסום
const Reading = require('./models/Reading'); // מודל קריאות
const Token = require('./models/Token'); // מודל טוקן

const app = express();
app.use(express.json()); // מאפשר לקבל בקשות ב-JSON
app.use(cors({
  origin: "http://localhost:3000"
}));

// חיבור ל-MongoDB Atlas

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
  const { username, password, role} = req.body;
  try{
   // חיפוש המשתמש במסד הנתונים
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // אימות תפקיד
    if (user.role !== role) {
      return res.status(403).json({ error: 'Role mismatch' });
    }

    // השוואת סיסמאות
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // החזרת נתונים על המשתמש אם הסיסמה נכונה
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/postRecommendation', async (req, res) => {
  const { name, description, role, rating } = req.body;

  if (!name || !description || !role || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const recommendation = await Recommendation.create({ name, description, role, rating });
    res.status(201).json({ message: 'Recommendation added successfully', recommendation });
  } catch (err) {
    console.error("Failed to add recommendation:", err);
    res.status(500).json({ error: 'Failed to add recommendation' });
  }
});

app.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await Recommendation.find().sort({ date: -1 });
    res.status(200).json(recommendations);
  } catch (err) {
    console.error("Failed to fetch recommendations:", err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

app.post('/postPublish', async (req, res) => {
  const { name, description, role } = req.body;

  if (!name || !description || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const publish= await Publish.create({ name, description, role });
    res.status(201).json({ message: 'publish added successfully', publish });
  } catch (err) {
    console.error("Failed to add publish:", err);
    res.status(500).json({ error: 'Failed to add publish' });
  }
});

app.get('/publish', async (req, res) => {
  try {
    const publish = await Publish.find().sort({ date: -1 });
    res.status(200).json(publish);
  } catch (err) {
    console.error("Failed to fetch publish:", err);
    res.status(500).json({ error: 'Failed to fetch publish' });
  }
});

//locations:
const apiUrl = 'https://atapi.atomation.net/api/v1/s2s/v1_0';
const deviceMAC = 'CB:85:C7:AB:66:81';
// פונקציה להשגת טוקן חדש מה-API ושמירתו במסד הנתונים
async function getSensorApiToken() {
  const url = `${apiUrl}/auth/login`;

  const headers = {
    "accept": "application/json",
    "app_version": "petpath-1.0.0",
    "access_type": 5,
    "Content-Type": "application/json",
  };

  const payload = {
    email: "sce@atomation.net",
    password: "123456",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.status}`);
    }

    const data = await response.json();
    const token = data?.data?.token;
    const refreshToken = data?.data?.refresh_token;
    const expiresIn = data?.data?.expires_in;

    if (token && refreshToken) {
      console.log("Token successfully retrieved!");

      // שמירת הטוקן במסד הנתונים
      const newToken = new Token({
        token: token,
        refreshtoken: refreshToken,
        expires: Date.now() + expiresIn * 1000, // זמן פקיעה בפורמט milliseconds
        date: new Date(),
      });
      await newToken.save();

      return newToken; // החזרת הטוקן שנשמר
    } else {
      throw new Error("Token or refresh token not found in response.");
    }
  } catch (error) {
    console.error(`Error fetching token: ${error.message}`);
    return null;
  }
}

// פונקציה לשליפת הטוקן האחרון ממסד הנתונים או יצירת חדש אם צריך
async function getValidToken() {
  let latestToken = await Token.findOne().sort({ date: -1 });

  // אם אין טוקן או שהטוקן פג תוקף
  if (!latestToken || Date.now() >= latestToken.expires) {
    console.log("Token missing or expired. Fetching a new token...");
    latestToken = await getSensorApiToken();
  }

  if (!latestToken) {
    throw new Error("Failed to retrieve or create a valid token.");
  }

  return latestToken;
}
async function fetchReadingsForSpecificDates() {
  try {
    const latestToken = await getValidToken(); // קבלת טוקן תקף

    const now = new Date(); // תאריך נוכחי
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // חישוב התאריכים: 21 עד 23
    const startDate = new Date(currentYear, currentMonth, 21, 0, 0, 0); // 21 לחודש, תחילת היום
    const endDate = new Date(currentYear, currentMonth, 23, 23, 59, 59); // 23 לחודש, סוף היום

    console.log(`Fetching readings from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const response = await fetch(`${apiUrl}/sensors_readings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${latestToken.token}`,
        "Content-Type": "application/json",
        "accept": "application/json",
      },
      body: JSON.stringify({
        filters: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          mac: [deviceMAC],
          createdAt: true,
        },
        limit: {
          page: 1,
          page_size: 1000, // מקסימום רשומות בבקשה אחת
        },
      }),
    });

    const info = await response.json();

    if (info?.code === 200) {
      const readingsData = info.data.readings_data;

      if (readingsData.length > 0) {
        const formattedReadings = readingsData.map((reading) => ({
          device_name: reading.device_name,
          location: `${reading.location.lat},${reading.location.lng}`,
          Temperature: reading.Temperature,
          mac: reading.mac,
          date: new Date(reading.sample_time_utc),
        }));

        console.log(`Saving ${formattedReadings.length} readings to MongoDB.`);
        await Reading.insertMany(formattedReadings); // שמירה ב-MongoDB
      } else {
        console.log("No readings found for the specified dates.");
      }
    } else {
      console.error("Failed to fetch readings:", info);
    }
  } catch (error) {
    console.error("Error fetching readings for specific dates:", error.message);
  }
}

// נקודת הגישה '/locations'
app.get("/locations", async (req, res) => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // טווח הזמן: שעתיים אחורה
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);  // בדיקה עבור עשר הדקות האחרונות

    // שליפת הטוקן התקף
    const latestToken = await getValidToken();

    // שליפת הקריאות ממסד הנתונים
    let readings = await Reading.find({ date: { $gte: twoHoursAgo } }).sort({ date: -1 });

    let repeat = 5;
    while (repeat > 0 && (readings.length === 0 || readings[0].date > tenMinutesAgo)) {
      console.log(`Got ${readings.length} readings from MongoDB.`);

      const latestReadingDate = readings.length ? readings[0].date : twoHoursAgo;

      console.log("Fetching readings from sensors API...");
      const currentDate = new Date();
      const apiResponse = await fetch(`${apiUrl}/sensors_readings`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${latestToken.token}`,
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({
          filters: {
            start_date: latestReadingDate.toISOString(),
            end_date: currentDate.toISOString(),
            mac: [deviceMAC],
            createdAt: true,
          },
          limit: {
            page: 1,
            page_size: 100,
          },
        }),
      });

      const info = await apiResponse.json();

      if (info?.code === 200) {
        const newReadings = info.data.readings_data.map((reading) => ({
          device_name: reading.device_name,
          location: `${reading.location.lat},${reading.location.lng}`,
          Temperature: reading.Temperature,
          mac: reading.mac,
          date: new Date(reading.sample_time_utc),
        }));

        // בדיקת קריאות שכבר קיימות במסד הנתונים
        const existingDates = await Reading.find({
          date: { $gte: latestReadingDate, $lte: currentDate },
          mac: deviceMAC,
        }).select("date -_id");

        const existingDatesSet = new Set(existingDates.map((entry) => entry.date.toISOString()));

        const uniqueReadings = newReadings.filter(
          (reading) => !existingDatesSet.has(reading.date.toISOString())
        );

        if (uniqueReadings.length > 0) {
          console.log(`Saving ${uniqueReadings.length} new readings to MongoDB.`);
          await Reading.insertMany(uniqueReadings); // שמירה ב-MongoDB
          readings = [...uniqueReadings, ...readings];
        } else {
          console.log("No new readings to save.");
        }

        repeat -= 1;
      } else if (info?.code === 401) {
        console.log("Refreshing token...");
        const refreshedToken = await getSensorApiToken();
        if (!refreshedToken) {
          throw new Error("Failed to refresh token.");
        }
      } else {
        throw new Error("Failed to fetch readings from sensors API.");
      }
    }

    res.status(200).json(readings);
  } catch (error) {
    console.error("Failed to fetch locations:", error.message);
    res.status(500).json({ error: "Failed to fetch locations." });
  }
});

    // filter readings for map locations
   // let locations = [];

    // res.status(200).json(locations);
    //res.status(200).json(readings);
 





// הפעלת השרת רק אם הקובץ נריץ ישירות
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;  // ייצוא של האפליקציה לבדיקות

