import React, { useEffect, useState } from "react";
import "./Alerts.css";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllAlerts, setShowAllAlerts] = useState(false); // אם להציג את ההתראות
  const [error, setError] = useState(""); // הודעת שגיאה

  const dummyAlerts = [
    { location: "רחוב חיים נחמן ביאליק, באר שבע", temperature: 36 },
    { location: "רחוב אברהם אבינו, באר שבע", temperature: 40 },
    { location: "רחוב בן צבי, באר שבע", temperature: 38 },
  ];

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch("${backendUrl}/locations");
        if (!response.ok) {
          throw new Error("שגיאה בטעינת הנתונים מהשרת");
        }
        const data = await response.json();
        checkForAlerts(data);
      } catch (error) {
        console.error("Error fetching readings:", error);
        setError("לא ניתן לטעון נתונים. אנא נסה מאוחר יותר.");
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  const checkForAlerts = (data) => {
    const highTempAlerts = data.filter(
      (reading) => reading.temperature > 30 // סינון טמפרטורות גבוהות
    );

    const alertsWithTime = highTempAlerts.map((alert) => ({
      ...alert,
      time: new Date().toLocaleTimeString(),
    }));

    setAlerts(alertsWithTime);
    setLoading(false);
  };

  const handleShowDummyAlerts = () => {
    // מוסיף את התראות הדמה לרשימה
    const alertsWithTime = dummyAlerts.map((alert) => ({
      ...alert,
      time: new Date().toLocaleTimeString(),
    }));
    setAlerts(alertsWithTime);
  };

  return (
    <div className="alerts-container">
      {loading && <p>נטען...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <button
          onClick={() => setShowAllAlerts(!showAllAlerts)}
          className="alerts-btn"
        >
          {showAllAlerts ? "הסתר התראות" : "התראות בזמן אמת"}
        </button>
      )}

      {showAllAlerts ? (
        alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div key={index} className="alert-item">
              <div className="alert-header">
                <strong>התראה: טמפרטורה גבוהה!</strong>
                <p>שעה: {alert.time}</p>
              </div>
              <p>רחוב: {alert.location}</p>
              <p>טמפרטורה: {alert.temperature}°C</p>
            </div>
          ))
        ) : (
          <div>
            <p>אין התראות כרגע.</p>
            <button onClick={handleShowDummyAlerts} className="dummy-alerts-btn">
              הצג התראות דמה
            </button>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Alerts;
