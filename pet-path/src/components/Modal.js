import React from 'react';
import './Modal.css';  // ייבוא קובץ ה-CSS למודל
import Login from './LogIn';
import Register from './Register';

const Modal = ({ isOpen, onClose, activeForm, setActiveForm }) => {
  if (!isOpen) return null;

  // קובע איזה טופס להציג
  const renderActiveForm = () => {
    switch (activeForm) {
      case 'login':
        return (
          <div className="form-side">
            <Login />
          </div>
        );
      case 'register':
        return (
          <div className="form-side">
            <Register />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-overlay">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <div className="tabs">
          <button
            className={activeForm === 'login' ? 'active' : ''}
            onClick={() => setActiveForm('login')}
          >
            התחברות
          </button>
          <button
            className={activeForm === 'register' ? 'active' : ''}
            onClick={() => setActiveForm('register')}
          >
            הרשמה
          </button>
        </div>

        <div className={`modal-content ${activeForm === 'login' ? 'move-left' : 'move-right'}`}>
          <div className="image-side">
            <img
              src={activeForm === 'login' ? "media/login.jpg" : "media/register.jpg"} 
              alt={activeForm === 'login' ? "Login Image" : "Register Image"}
            />
          </div>
          {renderActiveForm()}
        </div>
      </div>
    </div>
  );
};

export default Modal;
