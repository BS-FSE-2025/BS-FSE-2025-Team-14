import React, { useState, useEffect } from 'react';
import './Home.css';
import { switchLanguage } from './Translate'; // ייבוא נכון של הפונקציה
import { useNavigate } from 'react-router-dom'; // ייבוא שימוש ב-React Router


function DogwalkerDash({ isAuthenticated, onLogin, onRegister, user }) {
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
       const response = await fetch('http://localhost:3001/postPublish', {
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
         <button id="language-switcher" onClick={switchLanguage}>
           עברית / English
         </button>
         
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
             <li><a href="#" onClick={(e) => { e.preventDefault(); setShowProfile(!showProfile); }}>פרופיל</a></li>
             <li><a href="#" onClick={toggleSettings}>הגדרות המערכת</a></li> {/* כפתור הגדרות */}
             <li><a href="#reviews">כותבים עלינו</a></li>
             <li><a href="#publish">עסקים מומלצים</a></li>
             <li><button onClick={handleLogout} className="logout-button">התנתק</button></li> {/* כפתור התנתקות */}
           </ul>
         </nav>
       </header>
 
       <div className="divider"></div>
 
       {showProfile && userInfo && (
         <div className="profile-popup">
           <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>{userInfo.username} :שם משתמש</p>
         </div>
       )}
       
       {isSettingsOpen && (
   <div className="settings-popup" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
     <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>:הגדרות המערכת</p>
     <p style={{ fontSize: '16px', textAlign: 'center', marginTop: '0', marginBottom: '5px' }}>.(עברית,אנגלית) אפשרות שינוי שפה</p>
   </div>
 )}
 
 
 
 
 
       {/* הצגת חלונית הגדרות */}
       {isSettingsOpen && (
         <div className="settings-popup">
           
         </div>
       )}
 
       <div className="divider"></div>
 
       <div className="section" id="reviews">
         <h2>כותבים עלינו</h2>
         <p>חוות דעת וביקורות ממשתמשים מרוצים.</p>
       </div>
 
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
 

export default DogwalkerDash;
