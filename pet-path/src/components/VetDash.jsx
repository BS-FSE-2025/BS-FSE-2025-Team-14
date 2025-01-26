import React, { useState, useEffect } from 'react';
import './Home.jsx'
import './Home.css';
import TemperatureAverage from './TemperatureAverages'; // ייבוא רכיב ממוצע טמפרטורות
import { useNavigate } from 'react-router-dom'; // ייבוא שימוש ב-React Router




function VetDash({ isAuthenticated, onLogin, onRegister, user }) {
  const [userInfo, setUserInfo] = useState(user || null);
  const [showProfile, setShowProfile] = useState(false); // מצב להצגת פרופיל
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

  // ה-state החדש להצגת חלונית ההגדרות
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate(); // שימוש בפונקציה לנווט בין דפים

  useEffect(() => {
    if (!userInfo) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUserInfo(storedUser);
      }
    }
    fetchRecommendations();
    fetchPublish();
  }, [userInfo]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('https://petpath.onrender.com/recommendations');
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
      const response = await fetch('https://petpath.onrender.com/postRecommendation', {
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

  const fetchPublish = async () => {
    try {
      const response = await fetch('https://petpath.onrender.com/publish');
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
      const response = await fetch('https://petpath.onrender.com/postPublish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPublish),
      });

      const data = await response.json();
      if (response.status === 201) {
        setPublish((prevPublish) => [data.publish, ...prevPublish]);
        setNewPublish({ name: '', description: '', role: '' }); // Reset form
      } else {
        alert(data.error || 'Failed to add publish');
      }
    } catch (err) {
      console.error("Error adding publish:", err);
    }
  };

  // פונקציה שתשנה את מצב חלונית ההגדרות
  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // מחיקת המידע של המשתמש מה-localStorage
    setUserInfo(null); // איפוס המידע על המשתמש ב-state המקומי
    navigate('/'); // ניווט לדף הבית
  };

  return (
    <div>
      <header>
        
        <div className="logo-container">
          <div className="logo">
            <img src="/media/logo.png.jpg" alt="logo" />
          </div>
          <div className="site-name">
            <span>PetPath</span>
            <p className="tagline">הולכים על בטוח</p>
          </div>
        </div>
        <nav>
  <ul>
    <li><a href="#avg">ממוצע</a></li>
    <li><a href="#map">תכנן מסלול</a></li>
    <li><a href="#article">מידע</a></li>
    <li><a href="#reviews">כתבו עלינו</a></li>
    <li><a href="#publish">עסקים</a></li>
    <li><button onClick={handleLogout} className="logout-button">התנתק</button></li>
  </ul>
  <ul class="profile-settings">
    <li><a href="#profile" class="profile-link" onClick={(e) => { e.preventDefault(); setShowProfile(!showProfile); }}>פרופיל</a></li>
    <li><a href="#setting" class="settings-link" onClick={toggleSettings}>עזרה</a></li>
  </ul>
</nav>
      </header>

      {showProfile && userInfo && (
        <div className="profile-popup">
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>{userInfo.username} :שם משתמש</p>
        </div>
      )}
      
      {isSettingsOpen && (
  <div className="settings-popup" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'auto', padding: '20px', borderRadius: '8px', backgroundColor: '#f4f4f4', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>עזרה</p>
    <p style={{ fontSize: '16px', textAlign: 'center', marginBottom: '10px' }}>האפשרויות השונות במערכת</p>
    <ul style={{ fontSize: '16px', textAlign: 'center', marginTop: '0', padding: '0', listStyleType: 'none' }}>
      <li>חישוב ממוצע שבועי.</li>
      <li>הצגת מפות ומסלולים - אפשרות לראות מסלולים על המפה לפי חיישנים שמשתנים בזמן אמת.</li>
      <li>מאמרים - קריאה והבנת מידע חשוב על בריאות לכלב.</li>
      <li>הוספת המלצה - אפשרות להוסיף המלצות אישיות על האתר עבור בעלי כלבים אחרים.</li>
      <li>הוספת עסק לפרסום - אפשרות להוסיף עסקים בתחום הכלבים למסד הנתונים שלנו.</li>
      <li>התראות - קבלת התראות בזמן אמת על מצב מזג האוויר והבטיחות להליכה עם הכלב.</li>
    </ul>
  </div>
)}

      {/* הצגת חלונית הגדרות */}
      {isSettingsOpen && (
        <div className="settings-popup">
          
        </div>
      )}
            <div className="divider"></div>

            <div className="section" id="avg">
            <TemperatureAverage /> {/* רכיב ממוצע הטמפרטורה */}
</div>

      <div className="divider"></div>
      <div className="section" id="map">
            <iframe //showing MAP file using iframe
              src= "/maps.html"  
              width="100%"    
              height="600px"   
              style={{ border: 'none' }}  
              title="מפה"
            ></iframe>
      </div>
     
      <div className="divider"></div>
     
            <div className="articles-container section"> 
              <h2>מאמרים מומלצים</h2>
              <div className="articles-grid">
                <div className="article-item">
                  <a href="https://www.ynet.co.il/articles/0,7340,L-4993123,00.html" target="_blank" rel="noopener noreferrer">
                    <img src="/media/article1.jpg" alt="מאמר 1" className="article-image" />
                  </a>
                  <p>המלצות לימים חמים</p>
                </div>
                <div className="article-item">
                  <a href="https://www.starsandstripesdogrescue.org/post/how-heat-affects-walking-your-dog" target="_blank" rel="noopener noreferrer">
                    <img src="/media/article2.jpg" alt="מאמר 2" className="article-image" />
                  </a>
                  <p>כיצד חום משפיע על טיולים עם הכלב</p>
                </div>
                <div className="article-item">
                  <a href="https://www.33rdsquare.com/helping-your-dog-heal-a-comprehensive-guide-to-treating-paw-pad-burns/" target="_blank" rel="noopener noreferrer">
                    <img src="/media/article3.jpg" alt="מאמר 3" className="article-image" />
                  </a>
                  <p>מדריך לטיפול בכוויות בכפות הרגליים של כלבים</p>
                </div>
                <div className="article-item">
                  <a href="https://wolfcenter.org/paws-can-help-dogs-regulate-their-temperature/" target="_blank" rel="noopener noreferrer">
                    <img src="/media/article4.jpg" alt="מאמר 4" className="article-image" />
                  </a>
                  <p>איך כפות הרגליים עוזרות לכלבים לווסת חום</p>
                </div>
                <div className="article-item">
                  <a href="https://www.akc.org/expert-advice/health/dog-paws-hot-pavement/" target="_blank" rel="noopener noreferrer">
                    <img src="/media/article5.jpg" alt="מאמר 5" className="article-image" />
                  </a>
                  <p>כלבים ומדרכות חמות</p>
                </div>
              </div>
        </div>
        <div className="divider"></div> 


      <div className="section" id="reviews">
        <h2>כותבים עלינו</h2>
        <p>חוות דעת וביקורות ממשתמשים מרוצים.</p>
      </div>
      <div className="divider"></div>


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
            <option value="dogowner">בעל כלב</option>
          </select>
          <label>דירוג:</label>
              <select
                name="rating"
                value={newRecommendation.rating || ''}
                onChange={handleRecommendationChange}
              >
                <option value="">בחר דירוג</option>
                <option value="1">⭐</option>
                <option value="2">⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="5">⭐⭐⭐⭐⭐</option>
              </select>
          <button type="submit">הוסף המלצה</button>
        </form>
      </div>

      <div className="recommendations-list">
        <h3>המלצות קיימות</h3>
        {recommendations.length > 0 ? (
          recommendations.map((recommendation) => (
            <div key={recommendation._id} className="recommendation-item">
              <h4>{recommendation.name}</h4>
              <p>{recommendation.description}</p>
              <p><strong>{recommendation.role}</strong></p>
              <p>דירוג:</p>
                <div className="star-rating">
                  {[...Array(5)].map((star, index) => (
                    <span key={index} style={{ color: index < recommendation.rating ? 'gold' : 'gray' }}>
                      ★
                    </span>
                  ))}
                </div>
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
      <div className="divider"></div>


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
            placeholder="השירותים שהעסק שלי מציע"
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

export default VetDash;


// css:
