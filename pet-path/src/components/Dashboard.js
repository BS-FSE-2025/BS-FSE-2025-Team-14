import React from 'react';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const { user } = location.state || {};  // נקבל את הנתונים שהעברנו ממסך ההתחברות

  if (!user) {
    return <p>אנא התחבר קודם!</p>;
  }

  return (
    <div className="screen">
      <h2>Dashboard</h2>

      {user.role === 'vet' && (
        <div>
          <h3>Welcome, Veterinarian!</h3>
          <p>You can manage health records and schedules for pets here.</p>
        </div>
      )}

      {user.role === 'dogwalker' && (
        <div>
          <h3>Welcome, Dog Walker!</h3>
          <p>You can view your scheduled walks and dog profiles.</p>
        </div>
      )}

      {user.role === 'dogowner' && (
        <div>
          <h3>Welcome, Dog Owner!</h3>
          <p>You can manage your dog’s walking routes, schedule walks, and more.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
