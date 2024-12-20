import React, { useState, useEffect } from 'react';
import './Home.css';

function DogownerDash({ user }) {
  const [recommendations, setRecommendations] = useState([]);
  const [newRecommendation, setNewRecommendation] = useState({
    name: '',
    description: '',
    role: '',
  });
  const [publish, setPublish] = useState([]);
  const [newPublish, setNewPublish] = useState({
    name: '',
    description: '',
    role: '',
  });

  useEffect(() => {
    fetchRecommendations();
    fetchPublish();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:3001/recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
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
        setNewRecommendation({ name: '', description: '', role: '' });
      } else {
        alert(data.error || 'Failed to add recommendation');
      }
    } catch (err) {
      console.error('Error adding recommendation:', err);
    }
  };

  const fetchPublish = async () => {
    try {
      const response = await fetch('http://localhost:3001/publish');
      const data = await response.json();
      setPublish(data);
    } catch (err) {
      console.error('Failed to fetch publish:', err);
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
        setNewPublish({ name: '', description: '', role: '' });
      } else {
        alert(data.error || 'Failed to add publish');
      }
    } catch (err) {
      console.error('Error adding publish:', err);
    }
  };

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
            <li><a href="#profile">פרופיל</a></li>
            <li><a href="#settings">הגדרות המערכת</a></li>
            <li><a href="#support">עזרה ותמיכה</a></li>
          </ul>
        </nav>
      </header>

      <div className="divider"></div>

      <div
        className="main-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '50vh',
          textAlign: 'center',
        }}
      >
        <h1>ברוך הבא!</h1>
        <p>כאן יוצגו לבעל כלב נתונים שונים</p>
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
          <p>אין המלצות כרגע</p>
        )}
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

      <div className="publish-list">
        <h3>עסקים קיימים</h3>
        {publish.length > 0 ? (
          publish.map((pub) => (
            <div key={pub._id} className="publish-item">
              <h4>{pub.name}</h4>
              <p>{pub.description}</p>
              <p><strong>{pub.role}</strong></p>
            </div>
          ))
        ) : (
          <p>אין עסקים כרגע</p>
        )}
      </div>

      <div className="divider"></div>
    </div>
  );
}

export default DogownerDash;
