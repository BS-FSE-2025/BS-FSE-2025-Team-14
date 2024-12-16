// Register.js
import React, { useState } from 'react';
import { registerUser } from '../auth';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('dogowner');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await registerUser(username, password, role);
      alert('המשתמש נרשם בהצלחה');
      console.log(user);
    } catch (error) {
      alert('שגיאה ברישום');
    }
  };

  return (
    <div>
      <h1>הרשמה</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם משתמש:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>סיסמה:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>סוג משתמש:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="dogowner">בעל כלב</option>
            <option value="dogwalker">דוג ווקר</option>
            <option value="vet">וטרינר</option>
          </select>
        </div>
        <button type="submit">הרשם</button>
      </form>
    </div>
  );
}

export default Register;
