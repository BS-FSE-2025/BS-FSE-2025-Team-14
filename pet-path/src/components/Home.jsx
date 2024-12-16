import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Home.css';

function Home({ isAuthenticated, onLogin, onRegister, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState('login');

  useEffect(() => {
    if (isAuthenticated) {
      setIsModalOpen(false); // אם המשתמש מחובר, נסגור את המודל
    }
  }, [isAuthenticated]);

  const openModal = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true); // אם המשתמש לא מחובר, נפתח את המודל
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <header>
        <div className="logo-container">
          <div className="logo">
            <img src="media/logo.png.jpg" alt="logo" />
          </div>
          <div className="site-name">
            <span>PetPath</span>
            <p className="tagline">הולכים על בטוח</p>
          </div>
        </div>
        <nav>
          <ul>
            <li><a href="#about">אודות</a></li>
            <li><a href="#team">מי אנחנו</a></li>
            <li><a href="#features">אפשרויות</a></li>
            <li><a href="#reviews">כותבים עלינו</a></li>
          </ul>
        </nav>
        {!isAuthenticated && (
          <button className="register-button" onClick={openModal}>
            הצטרפות
          </button>
        )}
      </header>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          activeForm={activeForm}
          setActiveForm={setActiveForm}
          onLogin={onLogin}
          onRegister={onRegister}
        />
      )}

      <div className="divider"></div>

      <div className="section" id="about">
        <h2>אודות</h2>
        <p>PetPath –מערכת חכמה לתכנון טיולים בטוחים לכלבים</p>
        <p>המסייעת לבחור את הזמן והמקום האידיאליים לטיול ופעילויות חוץ עם כלבים</p>
        <p>תוך התחשבות בתנאי מזג האוויר, טמפרטורת הקרקע ורמת הקרינה.</p>
      </div>

      <div className="divider"></div>

      <div className="section" id="features">
        <h2>מה אנחנו מציעים?</h2>
        <ul>
          <li>טיולים בטוחים בהתאם לטמפרטורה</li>
          <li>מעקב אחרי בטיחות הקרקע בזמן אמת</li>
          <li>הצגת מפות ומסלולים מומלצים</li>
          <li>תכנון לו"ז בהתאם לטמפרטורת הקרקע</li>
        </ul>
        <p>ומה עוד? הצטרפו אלינו וגלו!</p>
      </div>

      <div className="divider"></div>

      <div className="section" id="team">
        <h2>מי אנחנו</h2>
        <div className="team-container">
          <div className="team-member">
            <img src="media/ori.jpg" alt="אורי אוחנה" />
            <p>אורי אוחנה</p>
          </div>
          <div className="team-member">
            <img src="media/yael.jpg" alt="יעל לוין" />
            <p>יעל לוין</p>
          </div>
          <div className="team-member">
            <img src="media/noam.jpg" alt="נועם מימון" />
            <p>נועם מימון</p>
          </div>
          <div className="team-member">
            <img src="media/hadar.jpg" alt="הדר טרבלסי" />
            <p>הדר טרבלסי</p>
          </div>
        </div>
        <p>
          <strong>קבוצה 14</strong> היא קבוצה של סטודנטים שמאמינים שבעזרת הטכנולוגיות המתקדמות של היום,
          ניתן לשפר את איכות החיים של כלבים ובעליהם. החזון שלנו הוא ליצור כלים חכמים שיעזרו לשמור על בריאותם
          ושלומם של החברים הכי טובים שלנו על ארבע, תוך מתן פתרונות מודרניים לאתגרים יומיומיים.
          יחד, אנחנו פועלים מתוך אהבה לבעלי חיים ומתוך אמונה שהטכנולוגיה יכולה לשנות חיים - גם של כלבים וגם של בני אדם.
        </p>
      </div>

      <div className="divider"></div>

      <div className="section" id="reviews">
        <h2>כותבים עלינו</h2>
        <p>חוות דעת וביקורות ממשתמשים מרוצים.</p>
      </div>

      <footer>
        <div className="footer-content">
          <p>&copy; 2024 PetPath. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
