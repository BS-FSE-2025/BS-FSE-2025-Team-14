// Login.test.js
import { render, fireEvent } from '@testing-library/react';
import Login from './Login'; 
import { useNavigate } from 'react-router-dom';

// Mock עבור useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login', () => {
  it('מנווטת כראוי לפי התפקיד של המשתמש', async () => {
    const navigate = require('react-router-dom').useNavigate();
    const { getByPlaceholderText, getByText, getByRole } = render(<Login />);

    // מילוי הטופס עם נתונים
    fireEvent.change(getByPlaceholderText(/שם משתמש/i), { target: { value: 'dogowner' } });
    fireEvent.change(getByPlaceholderText(/סיסמה/i), { target: { value: 'password123' } });
    fireEvent.change(getByRole('combobox'), { target: { value: 'dogowner' } });

    // שליחת הטופס
    fireEvent.click(getByText(/התחבר/i));

    // בדיקה אם הפונקציה navigate נקראה עם המסלול הנכון
    expect(navigate).toHaveBeenCalledWith('/dashboard/dogowner', expect.any(Object));
  });
});
