import React, { useEffect, useState } from "react";
import "./TemperatureAverage.css";

const TemperatureAverage = () => {
  const [readings, setReadings] = useState([]); // קריאות טמפרטורה
  const [average, setAverage] = useState(null); // הממוצע
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [error, setError] = useState(""); // הודעת שגיאה

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const response = await fetch("http://localhost:3001/locations");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("נתונים שהתקבלו:", data); // הדפסת הנתונים שהתקבלו
        setReadings(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching readings:", err);
        setError("לא הצלחנו לטעון את הנתונים. נסה שוב מאוחר יותר.");
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  const calculateMonthlyAverage = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // מחזיר את התאריך לפני חודש

    // סינון קריאות מהחודש האחרון לבאר שבע
    const filteredReadings = readings.filter((reading) => {
      const readingDate = new Date(reading.date);
      const isInBeersheva = reading.location === "באר שבע"; // אם הקריאה היא מבאר שבע
      const isWithinLastMonth = readingDate >= oneMonthAgo; // אם הקריאה היא בחודש האחרון
      return isInBeersheva && isWithinLastMonth;
    });

    if (filteredReadings.length === 0) {
      setAverage(0);
      return;
    }

    const totalTemperature = filteredReadings.reduce(
      (sum, reading) => sum + reading.Temperature,
      0
    );
    const avg = totalTemperature / filteredReadings.length;
    setAverage(avg.toFixed(2)); // מעגלים ל-2 ספרות אחרי הנקודה
  };

  return (
    <div className="temperature-average-container">
      {loading && <p>נטען...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <button onClick={calculateMonthlyAverage} className="calculate-btn">
          חשב ממוצע טמפרטורות לשבוע האחרון (באר שבע)
        </button>
      )}

      {average !== null && (
        <div className="average-display">
          <p>ממוצע טמפרטורות הקרקע בחודש האחרון בבאר שבע: {average}°C</p>
        </div>
      )}
    </div>
  );
};

export default TemperatureAverage;
