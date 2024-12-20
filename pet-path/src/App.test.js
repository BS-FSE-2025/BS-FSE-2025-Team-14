import { render, fireEvent, screen } from '@testing-library/react';
import Login from './Login'; // ייבוא של הקומפוננטה שלך
import { useNavigate } from 'react-router-dom'; 

// Mock עבור navigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(), // mock הפונקציה useNavigate
}));

describe('Login Component', () => {
  it('מנווטת כראוי לפי התפקיד של המשתמש', async () => {
    const navigate = useNavigate(); // הפונקציה המוקית
    render(<Login />); // render את הקומפוננטה

    // מילוי הטופס עם נתונים
    fireEvent.change(screen.getByPlaceholderText(/שם משתמש/i), { target: { value: 'dogowner' } });
    fireEvent.change(screen.getByPlaceholderText(/סיסמה/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'dogowner' } });

    // שליחת הטופס
    fireEvent.click(screen.getByText(/התחבר/i));

    // בדיקה אם הפונקציה navigate נקראה עם המסלול הנכון
    expect(navigate).toHaveBeenCalledWith('/dashboard/dogowner', expect.any(Object)); // מצפים לניווט לדף בעל כלב
  });

  it('מציגה הודעת שגיאה כאשר המשתמש לא נמצא', async () => {
    const navigate = useNavigate();
    render(<Login />);

    // מילוי הטופס עם נתונים שגויים
    fireEvent.change(screen.getByPlaceholderText(/שם משתמש/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText(/סיסמה/i), { target: { value: 'wrongpassword' } });

    // שליחת הטופס
    fireEvent.click(screen.getByText(/התחבר/i));

    // בדיקה אם הודעת שגיאה מוצגת
    expect(screen.getByText(/התחברות נכשלה!/i)).toBeInTheDocument();
  });
});

