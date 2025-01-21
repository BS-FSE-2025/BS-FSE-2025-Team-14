// משתנה גלובלי לשמירת 30 הקריאות האחרונות
let last30Readings = [];

// פונקציה למשיכת 30 הקריאות האחרונות מהשרת ועדכון המשתנה הגלובלי
export const fetchLast30Readings = async () => {
  try {
    const response = await fetch("http://localhost:3001/locations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    last30Readings = data; // עדכון הרשימה הגלובלית
    console.log("Updated last30Readings:", last30Readings);
  } catch (error) {
    console.error("Failed to fetch last 30 readings:", error.message);
  }
};

// פונקציה לגישה לנתונים המעודכנים
export const getLast30Readings = () => {
  return last30Readings;
};

// פונקציה לאתחול עדכון אוטומטי
export const startAutoUpdateReadings = () => {
  const updateReadings = async () => {
    console.log("Fetching last 30 readings...");
    await fetchLast30Readings();
  };

  updateReadings(); // קריאה ראשונית
  setInterval(updateReadings, 4 * 60 * 60 * 1000); // קריאה חוזרת כל 4 שעות
};
