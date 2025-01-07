import { loginUser } from '../auth';  // המודול שמבצע את ההתחברות
import { useNavigate } from 'react-router-dom';  // הפונקציה שבודקת את הניווט
import { jest } from '@jest/globals';

// Mock לפונקציות
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../auth', () => ({
  loginUser: jest.fn(),
}));

describe('Login Component', () => {
  it('מנווטת כראוי כווטרינר לדף הווטרינר', async () => {
    const mockNavigate = useNavigate();
    
    // mock של loginUser שמחזיר וטרינר (role: 'vet')
    loginUser.mockResolvedValueOnce({ role: 'vet' });

    const username = 'vetUser';
    const password = 'vetPassword';
    const role = 'vet';

    // חיקוי של קריאת ההתחברות לפונקציה
    const user = await loginUser(username, password, role);

    // אם התחבר כווטרינר, אז הניווט אמור לקרות לדף של הווטרינר
    expect(user.role).toBe('vet');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/vet', expect.any(Object));
  });
});
