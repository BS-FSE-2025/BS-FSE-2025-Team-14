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
          <div className="modal-content move-left">
            <div className="form-side">
              <Login />
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="modal-content move-right">
            <div className="form-side">
              <Register />
            </div>
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
        {renderActiveForm()}
      </div>
    </div>
  );
};

export default Modal;
