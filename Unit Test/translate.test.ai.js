import { updatePageText, currentLanguage } from '../pet-path/src/components/Translate'

it('should update text correctly when switching languages', () => {
  document.body.innerHTML = '<div id="testElement">אודות</div>';
  currentLanguage = 'en';  
  updatePageText();
  expect(document.getElementById('testElement').innerText).toBe('About');
});
