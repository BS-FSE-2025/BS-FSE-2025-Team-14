import React, { useState, useEffect } from "react";
import "./ScrollToTop.css"; // שימי את ה-CSS בקובץ נפרד

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // מאזין למיקום הגלילה של המשתמש
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // פונקציה לגלילה למעלה
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <button
        className="scroll-to-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ⬆️ למעלה
      </button>
    )
  );
};

export default ScrollToTop;
