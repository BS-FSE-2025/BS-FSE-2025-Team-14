import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import VetDash from './components/VetDash'; 
import DogownerDash from './components/DogownerDash';
import DogwalkerDash from './components/DogwalkerDash';
import Alerts from "./components/Alerts";
import ScrollToTop from "./components/ScrollToTop"; // ייבוא רכיב הגלילה למעלה

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // מצב אימות משתמש
  const [user, setUser] = useState(null); // לאחסון פרטי המשתמש לאחר התחברות/הרשמה

  return (
    <>
      <Alerts /> {/* הוספת רכיב Alerts */}
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} user={user} />} />
        <Route path="/dashboard/vet" element={<VetDash />} />
        <Route path="/dashboard/dogowner" element={<DogownerDash />} />
        <Route path="/dashboard/dogwalker" element={<DogwalkerDash />} />
      </Routes>
      <ScrollToTop /> {/* הוספת כפתור גלילה למעלה */}
    </>
  );
}

export default App;
