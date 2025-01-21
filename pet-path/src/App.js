import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import VetDash from './components/VetDash'; 
import DogownerDash from './components/DogownerDash';
import DogwalkerDash from './components/DogwalkerDash';
import Alerts from "./components/Alerts";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for checking if user is logged in
  const [user, setUser] = useState(null); // To store user info after login/register

  return (
    <>
      <Alerts /> {/* הוספת רכיב Alerts */}
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} user={user} />} />
        <Route path="/dashboard/vet" element={<VetDash />} />
        <Route path="/dashboard/dogowner" element={<DogownerDash />} />
        <Route path="/dashboard/dogwalker" element={<DogwalkerDash />} />
      </Routes>
    </>
  );
}

export default App;