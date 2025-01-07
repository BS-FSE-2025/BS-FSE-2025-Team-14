import React, { useEffect, useState } from "react";
import "./Alerts.css";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // שדה חדש לניהול שגיאות
  const [showAllAlerts, setShowAllAlerts] = useState(false); // אם להציג את ההתראות

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch("http://localhost:3001/locations");
        if (!response.ok) {
          throw new Error("Failed to fetch data from server");
        }
        const data = await response.json();
        console.log("Data received:", data); // הדפסת הנתונים שהתקבלו
        checkForAlerts(data);
      } catch (error) {
        console.error("Error fetching readings:", error);
        setError("לא הצלחנו לטעון את הנתונים. נסה שוב מאוחר יותר.");
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  // פונקציה להמיר פרהנייט לצלזיוס
  const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * (5 / 9);
  };

  const checkForAlerts = (data) => {
    console.log("Checking for alerts..."); // לוג בשביל להבין אם הפונקציה מופעלת

    // המרת הטמפרטורה מ-פרהנייט לצלזיוס
    const highTempAlerts = data.filter((reading) => {
      const tempInCelsius = fahrenheitToCelsius(reading.Temperature);
      console.log(`Raw Temperature (F): ${reading.Temperature}, Converted Temp (C): ${tempInCelsius}°C`); // הדפסת טמפרטורות לפני ואחרי ההמרה

      return tempInCelsius > 10; // שינוי הסף מ-20 ל-10 מעלות צלזיוס
    });

    console.log("Filtered High Temperature Alerts:", highTempAlerts); // הדפסת ההתראות לאחר הסינון

    if (highTempAlerts.length > 0) {
      const alertsWithTime = highTempAlerts.map((alert) => ({
        ...alert,
        Temperature: fahrenheitToCelsius(alert.Temperature).toFixed(2),
        time: new Date().toLocaleTimeString(),
      }));

      console.log("Alerts with Time:", alertsWithTime); // הדפסת ההתראות עם הזמן
      setAlerts(alertsWithTime);
    } else {
      console.log("No alerts triggered!"); // לוג במקרה שאין התראות
      setAlerts([]); // אם אין התראות, נוודא שהמערך יהיה ריק
    }

    setLoading(false); // סיום מצב טעינה
  };

  return (
    <div className="alerts-container">
      {loading && !error && <p>נטען...</p>}
      {error && <p className="error-message">{error}</p>} {/* הצגת הודעת שגיאה */}

      {/* הצגת כפתור רק לאחר שהנתונים התקבלו */}
      {!loading && !error && (
        <button
          onClick={() => setShowAllAlerts(!showAllAlerts)}
          className="alerts-btn"
        >
          {showAllAlerts ? "הסתר התראות" : "התראות בזמן אמת"}
        </button>
      )}

      {showAllAlerts && !loading && (
        alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <div className="alert-header">
                <strong>התראה: טמפרטורה גבוהה!</strong>
                <p>שעה: {alert.time}</p>
              </div>
              <p>רחוב: {alert.location}</p>
              <p>טמפרטורה: {alert.Temperature}°C</p>
            </div>
          ))
        ) : (
          <p>אין התראות כרגע.</p>
        )
      )}
    </div>
  );
};

export default Alerts;
