
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

// פונקציה לשליפת טוקן תקף
async function getValidToken() {
  let latestToken = await Token.findOne().sort({ date: -1 });

  // אם אין טוקן או שהטוקן פג תוקף
  if (!latestToken || Date.now() >= latestToken.expires) {
    console.log("Token missing or expired. Refreshing token...");

    // אם יש Refresh Token, ננסה לרענן את הטוקן
    if (latestToken?.refreshtoken) {
      latestToken = await refreshToken(latestToken.refreshtoken); // קריאה לפונקציה לרענון הטוקן
    } else {
      throw new Error("No refresh token available to refresh the token.");
    }
  }

  if (!latestToken) {
    throw new Error("Failed to retrieve or create a valid token.");
  }

  return latestToken;
}

// פונקציה לרענון טוקן באמצעות ה-refresh token
async function refreshToken(refreshToken) {
  const url = `${apiUrl}/auth/refresh_token`;

  const headers = {
    "accept": "application/json",
    "app_version": "petpath-1.0.0",
    "access_type": 5,
    "Content-Type": "application/json",
  };

  const payload = {
    refresh_token: refreshToken,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) { // שורה חדשה
      throw new Error(`Failed to fetch new token using refresh token: ${response.status}`); // שורה חדשה
    }

    const data = await response.json();
    const token = data?.data?.token;
    const newRefreshToken = data?.data?.refresh_token;
    const expiresIn = data?.data?.expires_in;

    if (token && newRefreshToken) {
      console.log("Token successfully refreshed!");

      // שמירת הטוקן החדש במסד הנתונים
      const newToken = new Token({
        token: token,
        refreshtoken: newRefreshToken,
        expires: Date.now() + expiresIn * 1000, // זמן פקיעה בפורמט milliseconds
        date: new Date(),
      });
      await newToken.save();

      return newToken; // החזרת הטוקן החדש
    } else {
      throw new Error("Token or refresh token not found in response.");
    }
  } catch (error) { // שורות אלו שונו
    console.error(`Error refreshing token: ${error.message}`); // שורה חדשה
    console.log("Attempting to fetch a new token..."); // שורה חדשה

    // אם רענון הטוקן נכשל, ננסה לקבל טוקן חדש כמו בפעם הראשונה
    const newToken = await getSensorApiToken(); // שורה חדשה
    if (!newToken) { // שורה חדשה
      throw new Error("Failed to fetch a new token after refresh token failure."); // שורה חדשה
    }
    return newToken; // שורה חדשה
  }
}

async function manageDataFetchAndCleanup() {
  try {
    console.log("Starting data fetch and cleanup...");

    // משיכת נתונים ליומיים האחרונים
    const startDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // יומיים אחורה
    const endDate = new Date();
    await fetchReadings({ startDate, endDate });

    // מחיקת נתונים ישנים עד ה-7 בינואר 2025
    const january7 = new Date("2025-01-07T00:00:00Z");
    const result = await Reading.deleteMany({ date: { $lt: january7 } });
    console.log(`Deleted ${result.deletedCount} old readings created before January 7, 2025.`);

    // הערה: ניתן להחליף את המחיקה הקבועה למחיקה על בסיס שבוע וחצי אחרונים:
    /*
    const retentionDate = new Date(Date.now() - 10.5 * 24 * 60 * 60 * 1000); // שבוע וחצי אחורה
    const retentionResult = await Reading.deleteMany({ date: { $lt: retentionDate } });
    console.log(`Deleted ${retentionResult.deletedCount} old readings created before ${retentionDate.toISOString()}.`);
    */
   
  } catch (error) {
    console.error("Error in manageDataFetchAndCleanup:", error.message);
  }
}

function setupTasks() {
  manageDataFetchAndCleanup(); // הפעלה מיידית
  setInterval(manageDataFetchAndCleanup, 48 * 60 * 60 * 1000); // הפעלה כל 48 שעות
}
setupTasks();


//let lastReadingsData = []; // רשימה שמכילה נתונים על ה30 משיכות האחרונות שיש במונגו בשעה עכשיו בתאריך האחרון שקיים במונגו

async function fetchAndProcessReadings({ startDate, endDate }) {
  try {
    const latestToken = await getValidToken();
    console.log(`Fetching readings from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const response = await fetch(`${apiUrl}/sensors_readings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${latestToken.token}`,
        "Content-Type": "application/json",
        accept: "application/json",
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
          page_size: 600,
        },
      }),
    });

    const info = await response.json();
    if (info?.code === 200) {
      const readingsData = info.data.readings_data || [];
      console.log(`Processing ${readingsData.length} readings...`);

      if (readingsData.length > 0) {
        const formattedReadings = readingsData.map((reading) => ({
          device_name: reading.device_name,
          location: `${reading.location.lat},${reading.location.lng}`,
          Temperature: reading.Temperature,
          mac: reading.mac,
          date: new Date(reading.sample_time_utc),
        }));

        const threshold = 30 * 1000; // טווח זמן לבדיקה כפילויות
        for (const reading of formattedReadings) {
          const exists = await Reading.findOne({
            date: {
              $gte: new Date(reading.date.getTime() - threshold),
              $lte: new Date(reading.date.getTime() + threshold),
            },
            location: reading.location,
          });

          if (!exists) {
            await Reading.create(reading);
            console.log(`Saved reading from ${reading.date}`);
          } else {
            console.log(`Duplicate reading found for ${reading.date}`);
          }
        }
      }
    } else {
      console.error("Failed to fetch readings:", info);
    }
  } catch (error) {
    console.error("Error in fetchAndProcessReadings:", error.message);
  }
}

async function getReadingsFromDatabase({ startDate, endDate }) {
  try {
    return await Reading.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 });
  } catch (error) {
    console.error("Error fetching readings from database:", error.message);
    throw error;
  }
}

async function ensureReadings({ startDate, endDate }) {
  try {
    const readings = await getReadingsFromDatabase({ startDate, endDate });

    // אם אין נתונים מספקים, נמשוך מה-API
    if (readings.length === 0 || readings[0].date < new Date(Date.now() - 10 * 60 * 1000)) {
      console.log("Fetching readings from sensors API...");
      await fetchAndProcessReadings({ startDate, endDate });
    }

    // שליפה מחדש לאחר עדכון אפשרי
    return await getReadingsFromDatabase({ startDate, endDate });
  } catch (error) {
    console.error("Error ensuring readings:", error.message);
    throw error;
  }
}

// נקודת הגישה '/locations'
app.get("/locations", async (req, res) => {
  try {
    const now = new Date();
    const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000); // שעתיים אחורה
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000); // יום אחד אחורה

    // 1. בדיקה אם יש נתונים מהשעתיים האחרונות
    let readings = await ensureReadings({ startDate: twoHoursAgo, endDate: now });

    if (readings.length === 0) {
      console.log("No readings found in the last two hours. Checking last day...");
      // 2. בדיקה אם יש נתונים מהיום האחרון
      readings = await ensureReadings({ startDate: oneDayAgo, endDate: now });
    }

    if (readings.length === 0) {
      console.log("No readings found in the last day. Fetching last available readings...");
      // 3. משיכת 30 הקריאות האחרונות שנמצאות במונגו
      readings = await Reading.find().sort({ date: -1 }).limit(30);
    }

    // עיבוד הנתונים לפורמט הנדרש
    const processedReadings = readings.map((reading) => {
      const [lat, lng] = reading.location.split(','); // פיצול המיקום למספרים
      return {
        temperature: reading.Temperature,
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        date: reading.date,
      };
    });

    // שמירה על מקסימום של 30 קריאות
    const finalReadings = processedReadings.slice(0, 30);

    res.status(200).json(finalReadings);
  } catch (error) {
    console.error("Failed to fetch locations:", error.message);
    res.status(500).json({ error: "Failed to fetch locations." });
  }
});

async function uploadHistoricalData(startDate, endDate) {
  try {
    console.log(`Starting historical data upload from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    let currentStart = new Date(startDate);
    while (currentStart < endDate) {
      const currentEnd = new Date(Math.min(currentStart.getTime() + 48 * 60 * 60 * 1000, endDate.getTime())); // חישוב סיום הטווח הנוכחי (עד 48 שעות)

      console.log(`Fetching readings from ${currentStart.toISOString()} to ${currentEnd.toISOString()}`);
      
      await fetchAndProcessReadings({ startDate: currentStart, endDate: currentEnd }); // קריאה לפונקציה קיימת שמעלה נתונים
      
      currentStart = new Date(currentEnd); // מעבר לטווח הבא
    }

    console.log("Historical data upload completed!");
  } catch (error) {
    console.error("Error during historical data upload:", error.message);
  }
}
/*
const historicalStart = new Date("2025-01-07T00:00:00Z");
const historicalEnd = new Date("2025-01-15T00:00:00Z");

// הפעלה ידנית של הפונקציה להעלאת נתונים היסטוריים
uploadHistoricalData(historicalStart, historicalEnd);
*/

    // filter readings for map locations
   // let locations = [];

    // res.status(200).json(locations);
    //res.status(200).json(readings);
 

// פונקציה לקריאה ידנית
async function manualCleanup() {
  console.log('Starting manual cleanup...');
  try {
    await manageDataFetchAndCleanup(); // קריאה לפונקציה לניקוי
    console.log('Manual cleanup completed successfully!');
  } catch (error) {
    console.error('Error during manual cleanup:', error.message);
  }
}
//manualCleanup(); // הפעלה ידנית


// הפעלת השרת רק אם הקובץ נריץ ישירות
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;  // ייצוא של האפליקציה לבדיקות


////////////////
////////////////


