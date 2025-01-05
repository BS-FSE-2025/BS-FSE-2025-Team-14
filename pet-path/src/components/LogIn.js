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
      
      if (user.role) {
        localStorage.setItem('user', JSON.stringify(user));
        if (role === 'vet') {
          navigate('/dashboard/vet', { state: { user } }); // ניווט לדף הווטרינר
        } 
        if (role === 'dogowner'){
          navigate('/dashboard/dogowner', { state: { user } });
        }
        if (role === 'dogwalker'){
          navigate('/dashboard/dogwalker', { state: { user } });
        }
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
        <div>
          <label htmlFor="username">שם משתמש:</label>
          <input
            type="text"
            id="username"
            placeholder="הכנס שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">סיסמה:</label>
          <input
            type="password"
            id="password"
            placeholder="הכנס סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role">בחר תפקיד:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="dogowner">בעל כלב</option>
            <option value="dogwalker">דוג ווקר</option>
            <option value="vet">וטרינר</option>
          </select>
        </div>

        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}

export default Login;
