import React, { useState } from "react";
import "./DogFur.css"; // ייבוא ה-CSS לעיצוב

const DogFur = () => {
  const [selectedData, setSelectedData] = useState(null); // שימור המידע הנבחר
  const [activeId, setActiveId] = useState(null); // שמירה על ה-id של הכפתור שנלחץ

  // נתוני התמונות והמידע, מסודרים מהפרווה הקצרה לארוכה
  const data = [
    {
      id: 1,
      image: "/media/short.jpg", // פרווה קצרה
      title: "פרווה קצרה",
      text: `
        הכלב שלך בעל פרווה קצרה. 
        🐾 טמפרטורה מומלצת לטיול: 20–30 מעלות.
        🐾 הוא יכול להתמודד עם מזג אוויר חם יחסית, אך מומלץ להימנע מטיולים בשעות השיא של החום.
        🐾 כדאי לוודא שהוא לא שוהה זמן ממושך תחת שמש ישירה.
      `,
    },
    {
      id: 2,
      image: "/media/medium.jpg", // פרווה בינונית
      title: "פרווה בינונית",
      text: `
        הכלב שלך בעל פרווה בינונית. 
        🐾 טמפרטורה מומלצת לטיול: 15–25 מעלות.
        🐾 יש לקחת בחשבון שהוא רגיש גם לחום וגם לקור קיצוניים.
        🐾 חשוב להעניק לו מים במהלך הטיול ולוודא שהטיול נעשה בשעות מתאימות (בוקר מוקדם או ערב).
      `,
    },
    {
      id: 3,
      image: "/media/long.jpg", // פרווה ארוכה
      title: "פרווה ארוכה",
      text: `
        הכלב שלך בעל פרווה ארוכה. 
        🐾 טמפרטורה מומלצת לטיול: פחות מ-20 מעלות.
        🐾 פרווה ארוכה עוזרת לשמור עליו בחורף, אך עלולה לגרום לחימום יתר בקיץ.
        🐾 מומלץ לטייל בשעות קרירות בלבד ולהימנע ממגע עם קרקע לוהטת.
        🐾 אם הטמפרטורה גבוהה, כדאי להסתפק בטיולים קצרים ולוודא שתמיד יש מים זמינים.
      `,
    },
  ];

  // פונקציה שמטפלת בלחיצה על תמונה
  const handleButtonClick = (id) => {
    if (activeId === id) {
      // אם נלחץ על אותו כפתור, נסיר את המידע
      setSelectedData(null);
      setActiveId(null);
    } else {
      // אם נלחץ כפתור חדש, נציג את המידע
      const selected = data.find((item) => item.id === id);
      setSelectedData(selected.text);
      setActiveId(id);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>בחר את סוג הפרווה של הכלב</h2>
      <div className="image-buttons">
        {data.map((item) => (
          <div key={item.id} className="image-container">
            <h3>{item.title}</h3> {/* כותרת מעל כל תמונה */}
            <button onClick={() => handleButtonClick(item.id)}>
              <img 
                src={item.image} 
                alt={`Button ${item.id}`} 
              />
            </button>
          </div>
        ))}
      </div>
      {selectedData && <div className="result">{selectedData}</div>} {/* הצגת המידע */}
    </div>
  );
};

export default DogFur;
