document.addEventListener('DOMContentLoaded', function () {
    // אובייקטים של המודל ושל הכפתורים
    const modal = document.getElementById('modal');
    const openModalButton = document.getElementById('open-modal');
    const closeModalButton = document.getElementById('close-modal');
    
    // כפתורי טאב (התחברות והרשמה)
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const modalContent = document.querySelector('.modal-content');
    
    // לפתוח את המודל כשנלחץ על כפתור הצטרפות
    openModalButton.addEventListener('click', function () {
        modal.style.display = 'flex'; // להציג את המודל
    });

    // לסגור את המודל כשנלחץ על כפתור הסגירה
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none'; // להסתיר את המודל
    });

    // לסגור את המודל גם אם לוחצים מחוץ לו
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // הוספת האנימציות והמעברים בין הטפסים
    loginTab.addEventListener('click', function () {
        modalContent.classList.remove('move-right'); // הסרת האנימציה הקודמת
        modalContent.classList.add('move-left'); // הזזת התמונה והטופס שמאלה
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', function () {
        modalContent.classList.remove('move-left'); // הסרת האנימציה הקודמת
        modalContent.classList.add('move-right'); // הזזת התמונה והטופס ימינה
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
});