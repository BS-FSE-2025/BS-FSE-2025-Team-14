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
      // נסיים את ההתחברות
      const user = await loginUser(username, password);

      // אם ההתחברות הצליחה, נוודא את סוג המשתמש
      if (user.role === role) {
        // נוודא שהמשתמש מחובר כהלכה
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
    <div className="screen">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="dogowner">Dog Owner</option>
          <option value="dogwalker">Dog Walker</option>
          <option value="vet">Veterinarian</option>
        </select>
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
