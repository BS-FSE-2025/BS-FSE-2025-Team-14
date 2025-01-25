import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../auth';


function Login({ switchLanguage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('dogowner');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (switchLanguage) {
      switchLanguage(); // קרא לפונקציה לעדכן את התרגום עבור אלמנטים עם data-translate
    }
  }, [switchLanguage]);

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
      <h2 data-translate="loginTitle">התחבר</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" data-translate="usernameLabel">שם משתמש:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password"  data-translate="passwordLabel">סיסמה:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="role" data-translate="roleLabel">בחר תפקיד:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="dogowner" data-translate="dogOwnerOption">בעל כלב</option>
            <option value="dogwalker" data-translate="dogWalkerOption">דוג ווקר</option>
            <option value="vet" data-translate="vetOption">וטרינר</option>
          </select>
        </div>

        <button type="submit" data-translate="loginButton">התחבר</button>
      </form>
    </div>
  );
}

export default Login;
