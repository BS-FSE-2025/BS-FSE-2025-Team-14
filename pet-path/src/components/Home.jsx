import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Home.css';
import { switchLanguage } from './Translate'; // ייבוא נכון של הפונקציה

function Home({ isAuthenticated, onLogin, onRegister, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState('login');
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({
    name: '',
    description: '',
    role: '',
  });
  const [Publish, setPublish] = useState([]);
  const [newPublish, setNewPublish] = useState({
    name: '',
    description: '',
    role: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      setIsModalOpen(false); // אם המשתמש מחובר, נסגור את המודל
    }
      // Fetch existing recommendations
      fetchRecommendations();
    }, [isAuthenticated]);
  
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('http://localhost:3001/recommendations');
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      }
    };
  
    const handleRecommendationChange = (e) => {
      const { name, value } = e.target;
      setNewRecommendation((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleRecommendationSubmit = async (e) => {
      e.preventDefault();
      if (!newRecommendation.name || !newRecommendation.description || !newRecommendation.role) {
        alert('Please fill out all fields');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3001/postRecommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRecommendation),
        });
  
        const data = await response.json();
        if (response.status === 201) {
          setRecommendations((prevRecommendations) => [data.recommendation, ...prevRecommendations]);
          setNewRecommendation({ name: '', description: '', role: '' }); // Reset form
        } else {
          alert(data.error || 'Failed to add recommendation');
        }
      } catch (err) {
        console.error("Error adding recommendation:", err);
      }
    };


    
  useEffect(() => {
    if (isAuthenticated) {
      setIsModalOpen(false); // אם המשתמש מחובר, נסגור את המודל
    }
      // Fetch existing publish
      fetchPublish();
    }, [isAuthenticated]);
  
    const fetchPublish = async () => {
      try {
        const response = await fetch('http://localhost:3001/publish');
        const data = await response.json();
        setPublish(data);
      } catch (err) {
        console.error("Failed to fetch publish:", err);
      }
    };
  
    const handlePublishChange = (e) => {
      const { name, value } = e.target;
      setNewPublish((prev) => ({ ...prev, [name]: value }));
    };
    
    const handlePublishSubmit = async (e) => {
      e.preventDefault();
      if (!newPublish.name || !newPublish.description || !newPublish.role) {
        alert('Please fill out all fields');
        return;
      }
    
      try {
        const response = await fetch('http://localhost:3001/postPublish', { // תיקון לנתיב הנכון
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPublish),
        });
    
        const data = await response.json();
        if (response.status === 201) {
          setPublish((prevPublish) => [data.publish, ...prevPublish]); // תיקון איות
          setNewPublish({ name: '', description: '', role: '' }); // Reset form
        } else {
          alert(data.error || 'Failed to add publish');
        }
      } catch (err) {
        console.error("Error adding publish:", err);
      }
    };
    



  const openModal = () => {
    if (!isAuthenticated) {
      setIsModalOpen(true); // אם המשתמש לא מחובר, נפתח את המודל
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <header>
      <button id="language-switcher" onClick={switchLanguage}>
          עברית / English
        </button>
        
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
            <li><a href="#publish">עסקים מומלצים</a></li>
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
        <p>תוך התחשבות בתנאי מזג האוויר, טמפרטורת הקרקע ורמת הקרינה</p>
      </div>

      <div className="divider"></div>

      <div className="section" id="features">
        <h2>מה אנחנו מציעים?</h2>
        <ul>
          <li>טיולים בטוחים בהתאם לטמפרטורה</li>
          <li>מעקב אחרי בטיחות הקרקע בזמן אמת</li>
          <li>הצגת מפות ומסלולים מומלצים</li>
          <li>תכנון לוז בהתאם לטמפרטורת הקרקע</li>
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
        <p> <strong>קבוצה 14</strong>  </p>
        <p>אנחנו קבוצה של סטודנטים שמאמינים שעם טכנולוגיה מתקדמת אפשר לשפר את איכות החיים של החברים הכי טובים שלנו על ארבע  </p>
        <p>החזון שלנו הוא לפתח כלים חכמים לשמירה על בריאותם ולפתרון אתגרים יומיומיים  </p>
        <p>אנחנו פועלים מתוך אהבה לבעלי חיים ומאמינים שהטכנולוגיה יכולה לשפר חיים של כלבים ובני אדם.</p>
      </div>

      <div className="divider"></div>

      <div className="section" id="reviews">
        <h2>כותבים עלינו</h2>
        <p>חוות דעת וביקורות ממשתמשים מרוצים.</p>
      </div>
      {/* Add Recommendation Form */}
      
          <div className="recommendation-form">
            <h3>הוסף המלצה</h3>
            <form onSubmit={handleRecommendationSubmit}>
              <input
                type="text"
                name="name"
                placeholder="שם"
                value={newRecommendation.name}
                onChange={handleRecommendationChange}
              />
              <textarea
                name="description"
                placeholder="תיאור"
                value={newRecommendation.description}
                onChange={handleRecommendationChange}
              />
              <select
                name="role"
                value={newRecommendation.role}
                onChange={handleRecommendationChange}
              >
                <option value="">בחר תפקיד</option>
                <option value="vet">וטרינר</option>
                <option value="dogwalker">מטייל כלבים</option>
              </select>
              <button type="submit">הוסף המלצה</button>
            </form>
          </div>
        

        {/* Display Existing Recommendations */}
        <div className="recommendations-list">
          <h3>המלצות קיימות</h3>
          {recommendations.length > 0 ? (
            recommendations.map((recommendation) => (
              <div key={recommendation._id} className="recommendation-item">
                <h4>{recommendation.name}</h4>
                <p>{recommendation.description}</p>
                <p><strong>{recommendation.role}</strong></p>
              </div>
            ))
          ) : (
            <p>No recommendations yet</p>
          )}
        </div>

        <div className="divider"></div>
        <div className="section" id="publish">
           <h2>בעלי מקצוע</h2>
           <p>בעלי עסק מקצוענים שבוחרים PetPath</p>
           </div>
{/* Add publish Form */}

        <div className="publish-form">
            <h3>הוסף עסק</h3>
            <form onSubmit={handlePublishSubmit}>
              <input
                type="text"
                name="name"
                placeholder="שם"
                value={newPublish.name}
                onChange={handlePublishChange}
              />
              <textarea
                name="description"
                placeholder="תיאור"
                value={newPublish.description}
                onChange={handlePublishChange}
              />
              <select
                name="role"
                value={newPublish.role}
                onChange={handlePublishChange}
              >
                <option value="">בחר תפקיד</option>
                <option value="vet">וטרינר</option>
                <option value="dogwalker">מטייל כלבים</option>
              </select>
              <button type="submit">הוסף עסק</button>
            </form>
          </div>
        

        {/* Display Existing Publish */}
        <div className="Publish-list">
          <h3>עסקים קיימים</h3>
          {Publish.length > 0 ? (
            Publish.map((Publish) => (
              <div key={Publish._id} className="Publish-item">
                <h4>{Publish.name}</h4>
                <p>{Publish.description}</p>
                <p><strong>{Publish.role}</strong></p>
              </div>
            ))
          ) : (
            <p>No buisiness yet</p>
          )}
        </div>

         <div className="divider"></div>


      <footer>
        <div className="footer-content">
          <p>&copy; 2024 PetPath. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
