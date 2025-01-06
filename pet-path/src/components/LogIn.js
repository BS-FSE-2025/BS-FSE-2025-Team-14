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
    
        // בדיקת התאמה מפורשת של role לפני ניווט
        if (role === 'vet' && user.role === 'vet') {
          navigate('/dashboard/vet', { state: { user } }); // ניווט לדף הווטרינר
        } 
        else if (role === 'dogowner' && user.role === 'dogowner') {
          navigate('/dashboard/dogowner', { state: { user } }); // ניווט לדף בעל הכלב
        } 
        else if (role === 'dogwalker' && user.role === 'dogwalker') {
          navigate('/dashboard/dogwalker', { state: { user } }); // ניווט לדף דוג ווקר
        } 
        else {
          alert("התפקיד שנבחר אינו תואם לתפקיד במערכת!");
        }
      } else {
        alert("הסוג לא תואם! נסה שנית.");
      }
    } catch (error) {
      console.error("Login failed", error);
      // הצגת הודעת שגיאה מדויקת ב-alert
      if (error.response && error.response.data && error.response.data.error) {
        alert(`שגיאה: ${error.response.data.error}`);
      } else if (error.message) {
        alert(`שגיאה: ${error.message}`);
      } else {
        alert("שגיאה לא ידועה! נסה שוב.");
      }
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
