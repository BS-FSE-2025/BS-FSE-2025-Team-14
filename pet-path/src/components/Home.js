import React from 'react';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();
  const { user } = location.state || {};

  if (!user) {
    return <p>אנא התחבר קודם!</p>;
  }

  return (
    <div className="screen">
      <h1>Welcome to PetPath</h1>
      {user ? (
        <p>Hello, {user.username} ({user.userType})!</p>
      ) : (
        <p>Please login to continue.</p>
      )}
    </div>
  );
}

export default Home;
