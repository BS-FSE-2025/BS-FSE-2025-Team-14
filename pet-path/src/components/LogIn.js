// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('dogowner');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(username, password, role);
      if (user.role === role) {
        navigate(`/dashboard/${user.role}`, { state: { user } });
      } else {
        alert("הסוג לא תואם! נסה שנית.");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("התחברות נכשלה!");
    }
  };

  return (
    <div>
      <h2>התחבר</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="שם משתמש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="dogowner">בעל כלב</option>
          <option value="dogwalker">דוג ווקר</option>
          <option value="vet">וטרינר</option>
        </select>
        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}

export default Login;
