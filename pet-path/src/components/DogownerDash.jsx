import React, { useState, useEffect } from 'react';
import './Home.css';


function DogownerDash() {
  return (
    <div>
      <header>
        <div className="logo-container">
          <div className="logo">
            <img src="media\logo.png.jpg" alt="logo" />
          </div>
          <div className="site-name">
            <span>PetPath</span>
            <p className="tagline">הולכים על בטוח</p>
          </div>
        </div>
        <nav>
          <ul>
            <li><a href="#publish">הגדרות המערכת</a></li>
            <li><a href="#publish">עזרה ותמיכה</a></li>
          </ul>
        </nav>
      </header>

      <div className="divider"></div>

      <div className="main-content">
        <p>כאן יוצגו לבעל כלב נתונים שונים</p>
      </div>

      <div className="divider"></div>

      <footer>
        <div className="footer-content">
          <p>&copy; 2024 PetPath. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

export default DogownerDash;
