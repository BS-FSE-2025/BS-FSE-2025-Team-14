import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  it('נווט לממשק הראשי אם ההתחברות מצליחה', async () => {
    const navigate = useNavigate();
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('שם משתמש'), { target: { value: 'validuser' } });
    fireEvent.change(screen.getByPlaceholderText('סיסמה'), { target: { value: 'correctpassword' } });

    fireEvent.click(screen.getByText('התחבר'));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/main-interface');
    });
  });

  it('מציגה הודעת שגיאה במקרה של שגיאת מערכת', async () => {
    const navigate = useNavigate();
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('שם משתמש'), { target: { value: 'erroruser' } });
    fireEvent.change(screen.getByPlaceholderText('סיסמה'), { target: { value: 'errorpassword' } });

    fireEvent.click(screen.getByText('התחבר'));

    await waitFor(() => {
      expect(screen.getByText('שגיאת מערכת!')).toBeInTheDocument();
    });
  });
});
