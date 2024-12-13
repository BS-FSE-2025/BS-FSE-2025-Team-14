// auth.js

// פונקציה להתחברות
export const loginUser = async (username, password) => {
  const res = await fetch("http://localhost:3001/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username, password}),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error);
  }

  const user = result.user;
  const user_str = JSON.stringify(user);
  console.log(`login with user: ${user_str}`);
  return user;
};
  
// פונקציה לרישום משתמש חדש
export const registerUser = async (username, password, role) => {
  const newUser = { username, password, role };

  const res = await fetch("http://localhost:3001/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) {
    const result = await res.json();
    return result.error;
  };

  return newUser
};
  