import { updatePageText, currentLanguage} from '../pet-path/src/components/Translate'

describe('updatePageText', () => {
  it('should update text based on current language', () => {
    document.body.innerHTML = '<div id="testElement">About</div>';
    currentLanguage = 'he';  // שפה עברית
    updatePageText();
    expect(document.getElementById('testElement').innerText).toBe('אודות');
  });
});
