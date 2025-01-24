import { render, screen, fireEvent} from '@testing-library/react';
import Home from '../components/Home';
import * as Translate from '../components/Translate'; // ייבוא של הפונקציה switchLanguage


describe('Home Component', () => {
  it('renders without crashing', () => {
    render(<Home isAuthenticated={false} />);
  });
});

describe('Home Component2', () => {
  it('renders language switcher button', () => {
    render(<Home isAuthenticated={false} />);
    const languageSwitcher = screen.getByText(/עברית \/ English/i);
    expect(languageSwitcher).toBeInTheDocument();
  });
});

describe('Home Component - Language Switcher', () => {
  it('calls switchLanguage when clicking the language switcher button', () => {
    // Mock לפונקציית switchLanguage
    const switchLanguageMock = jest.spyOn(Translate, 'switchLanguage').mockImplementation(() => {});

    render(<Home isAuthenticated={false} />);
    const languageSwitcher = screen.getByText(/עברית \/ English/i);

    fireEvent.click(languageSwitcher); // סימולציה של לחיצה

    // ווידוא שהפונקציה switchLanguage נקראה
    expect(switchLanguageMock).toHaveBeenCalled();

    // ניקוי ה-Mock
    switchLanguageMock.mockRestore();
  });
});