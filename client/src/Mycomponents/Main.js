import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Main.css';
import axios from 'axios'; // For API calls

function SlidingWelcome({ username }) {
  const message = `Welcome, ${username}! I am so happy to see you here! Are you excited?! `;
  const words = message.split(' ');

  return (
    <div className="welcome-message">
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span className="slide-word" style={{ animationDelay: `${index * 0.3}s` }}>
            {word}
          </span>{' '}
        </React.Fragment>
      ))}
    </div>
  );
}

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state || { username: "Guest", email: "guest@example.com" };

  const [profileImage, setProfileImage] = useState(() =>
    localStorage.getItem(`profileImage-${user.email}`) || null
  );

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setProfileImage(base64);
        localStorage.setItem(`profileImage-${user.email}`, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Optional Cleanup for old image key (if needed)
  useEffect(() => {
    const old = localStorage.getItem('profileImage');
    if (old && !localStorage.getItem(`profileImage-${user.email}`)) {
      localStorage.setItem(`profileImage-${user.email}`, old);
      localStorage.removeItem('profileImage');
    }
  }, [user.email]);


  // Delete Account Handler
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Do you really want to delete your account?');
    if (!confirmed) return;

    try {
      const response = await axios.post('http://localhost:5000/delete_account', {
        email: user.email,
      });

      console.log('Account deleted:', response.data);

      // Remove stored image and navigate
      localStorage.removeItem(`profileImage-${user.email}`);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account. Please try again.');
    }
  };

  // Logout Handler (no image deletion)
  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      navigate('/');
    }
  };
  const handleAboutClick = () => {
    navigate('/about', { state: user });
  };

  return (
    <div className="main-container">
      {/* Left Section */}
      <div className="cartoon-section">
        <SlidingWelcome username={user.username} />
        <img src="/main.jpg" alt="Cartoon" className="cartoon-img" />
      </div>

      {/* Middle Section */}
      <div className="actions-section">
        <div className="arrow-container">
          <div className="arrow-text">Let's start the work,</div>
          <div className="arrow-text">buddy!</div>
          <img src="/arrow-top.png" alt="arrow to Start" className="arrow arrow-top" />
        </div>
        <button className="start-btn" onClick={() => navigate('/workspace', { state: user })}>
          Start
        </button>

        <button className="about-btn" onClick={handleAboutClick}>About</button>
        <div className="arrow-container">
          <img src="/arrow-bottom.png" alt="arrow to About" className="arrow arrow-bottom" />
          <div className="arrow-text">Want to know about</div>
          <div className="arrow-text">my website?</div>
        </div>
      </div>


      {/* Right Section */}
      <div className="account-section">
        <h4>User Account Info</h4>
        <div className="profile-wrapper">
          <label htmlFor="profile-upload" className="profile-pic">
            <img
              src={profileImage || '/default.png'}
              alt="Profile"
              className="profile-img"
            />
            <div className="camera-icon">📷</div>
          </label>
          <input
            type="file"
            id="profile-upload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
        <h3>{user.username}</h3>
        <p>{user.email}</p>
        <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Main;
