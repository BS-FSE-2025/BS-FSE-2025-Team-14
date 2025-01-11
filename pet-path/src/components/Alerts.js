import React, { useEffect, useState } from "react";
import "./Alerts.css";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    // קריאה ל-API כדי למשוך את הנתונים
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:3001/lastReadingsData");
    
        // אם התגובה לא תקינה (status 200), להוציא שגיאה
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
    
        const data = await response.json(); // המרת הנתונים מה-JSON
        setAlerts(data); // עדכון מצב התראות
        setLoading(false); // שינוי מצב טעינה
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("לא הצלחנו לטעון את הנתונים. נסה שוב מאוחר יותר.");
        setLoading(false); // שינוי מצב טעינה
      }
    };
  
    fetchAlerts(); // קריאה ל-API פעם אחת
  }, []);

  return (
    <div className="alerts-container">
      {loading && !error && <p>נטען...</p>}
      {error && <p className="error-message">{error}</p>}

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
                <p>שעה: {new Date(alert.date).toLocaleTimeString()}</p>
              </div>
              <p>מיקום: {alert.location.lat}, {alert.location.lng}</p>
              <p>טמפרטורה: {alert.temperature}°C</p>
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
