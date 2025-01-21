import React, { useEffect, useState } from "react";
import "./Alerts.css"; 

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllAlerts, setShowAllAlerts] = useState(false); // אם להציג את ההתראות

  const dummyAlerts = [
    { location: "רחוב חיים נחמן ביאליק, באר שבע", Temperature: 36 },
    { location: "רחוב אברהם אבינו, באר שבע", Temperature: 40 },
    { location: "רחוב בן צבי, באר שבע", Temperature: 38 },
  ];
  
  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch("http://localhost:3001/locations");
        const data = await response.json();
        checkForAlerts(data);
      } catch (error) {
        console.error("Error fetching readings:", error);

        setLoading(false); // מפסיקים את מצב הטעינה אם יש שגיאה
      }

    };

    fetchReadings();
  }, []);

  const checkForAlerts = (data) => {
    const highTempAlerts = data.filter((reading) => reading.Temperature > 30);
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
      <button
        onClick={() => setShowAllAlerts(!showAllAlerts)}
        className="alerts-btn"
      >
        {showAllAlerts ? "הסתר התראות" : "התראות בזמן אמת"}
      </button>

      {showAllAlerts ? (
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

          <div>
            <p>אין התראות כרגע.</p>
            <button
              onClick={handleShowDummyAlerts}
              className="dummy-alerts-btn"
            >
              הצג התראות דמה
            </button>
          </div>
        )
      ) : null}
    </div>
  );
};

export default Alerts;
