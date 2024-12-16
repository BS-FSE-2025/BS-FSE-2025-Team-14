import React, { useState } from 'react';
import Home from './components/Home';
import { useNavigate } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for checking if user is logged in
  const [user, setUser] = useState(null); // To store user info after login/register
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // // Navigating to the user's specific dashboard based on their role
    navigate(`/dashboard/${userData.role}`);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Navigating to the user's specific dashboard based on their role
    navigate(`/dashboard/${userData.role}`);  // כעת, אחרי התחברות או הרשמה, המשתמש יועבר לעמוד ה-dashboard המתאים (כגון /dashboard/dogowner, /dashboard/dogwalker, או /dashboard/vet).
  };

  return (
    <div>
      <Home 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        user={user} 
      />
    </div>
  );
}

export default App;
