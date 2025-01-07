import React from 'react'; 
import { fireEvent, render, screen } from '@testing-library/react';
import Login from '../pet-path/src/components/LogIn';  
import { useNavigate } from 'react-router-dom';  


jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  it('מנווטת כראוי לווטרינר אחרי התחברות', async () => {
    const navigate = useNavigate(); 

    
    render(<Login />); 

    
    fireEvent.change(screen.getByPlaceholderText(/שם משתמש/i), { target: { value: 'vetuser' } });
    fireEvent.change(screen.getByPlaceholderText(/סיסמה/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'vet' } });

    
    fireEvent.submit(screen.getByRole('form')); 

  
    expect(navigate).toHaveBeenCalledWith('/dashboard/vet', expect.any(Object));
  });
});
